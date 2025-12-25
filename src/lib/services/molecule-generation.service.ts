/**
 * Secure Molecular Generation Service
 * Server-side proxy for NVIDIA MolMIM API
 * Implements token-based authentication and rate limiting
 */

import { ValidationResult, validateMolecule, calculateBatchStatistics } from '../cheminformatics/molecular-descriptors';

export interface GenerationRequest {
  inputSmiles: string;
  similarityThreshold: number;
  numMolecules: number;
  optimizationCriteria?: {
    targetQED?: number;
    maxSAScore?: number;
    logPRange?: [number, number];
  };
}

export interface GeneratedMolecule {
  smiles: string;
  similarity: number;
  validation: ValidationResult;
  formula?: string;
  iupacName?: string;
}

export interface GenerationResponse {
  success: boolean;
  molecules: GeneratedMolecule[];
  metadata: {
    timestamp: string;
    inputSmiles: string;
    parameters: GenerationRequest;
    statistics: any;
    successRate: number;
    totalGenerated: number;
    validatedCount: number;
  };
  error?: string;
}

/**
 * Server-side molecular generation using NVIDIA MolMIM API
 * This replaces the client-side CORS-dependent implementation
 */
export async function generateMoleculesSecure(
  request: GenerationRequest,
  userId: string
): Promise<GenerationResponse> {
  try {
    // Validate input SMILES
    const inputValidation = validateMolecule(request.inputSmiles);
    if (!inputValidation.valid) {
      throw new Error('Invalid input SMILES structure');
    }

    // Call NVIDIA MolMIM API via secure backend proxy
    const nvidiaResponse = await callNvidiaMolMIMAPI({
      algorithm: 'MolMIM',
      smilesInput: request.inputSmiles,
      numSamples: request.numMolecules,
      similarity: request.similarityThreshold,
    });

    if (!nvidiaResponse.success) {
      throw new Error(nvidiaResponse.error || 'API call failed');
    }

    // Process and validate generated molecules
    const molecules: GeneratedMolecule[] = [];
    const validations: ValidationResult[] = [];

    for (const mol of nvidiaResponse.molecules || []) {
      const validation = validateMolecule(mol.smiles, mol.formula);
      validations.push(validation);

      // Apply optimization criteria if specified
      if (request.optimizationCriteria) {
        const { targetQED, maxSAScore, logPRange } = request.optimizationCriteria;
        
        let passesFilters = true;

        if (targetQED && validation.descriptors.qed < targetQED) {
          passesFilters = false;
        }

        if (maxSAScore && validation.descriptors.sa_score > maxSAScore) {
          passesFilters = false;
        }

        if (logPRange) {
          const [minLogP, maxLogP] = logPRange;
          if (validation.descriptors.logP < minLogP || validation.descriptors.logP > maxLogP) {
            passesFilters = false;
          }
        }

        if (!passesFilters) continue;
      }

      molecules.push({
        smiles: mol.smiles,
        similarity: mol.similarity || 0,
        validation,
        formula: mol.formula,
        iupacName: mol.iupacName,
      });
    }

    // Calculate statistics
    const statistics = calculateBatchStatistics(validations);
    
    // Calculate success rate
    const successRate = (statistics.druglike_count / statistics.total) * 100;

    return {
      success: true,
      molecules,
      metadata: {
        timestamp: new Date().toISOString(),
        inputSmiles: request.inputSmiles,
        parameters: request,
        statistics,
        successRate: Math.round(successRate * 100) / 100,
        totalGenerated: nvidiaResponse.molecules?.length || 0,
        validatedCount: molecules.length,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      molecules: [],
      metadata: {
        timestamp: new Date().toISOString(),
        inputSmiles: request.inputSmiles,
        parameters: request,
        statistics: null,
        successRate: 0,
        totalGenerated: 0,
        validatedCount: 0,
      },
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Secure backend proxy to NVIDIA MolMIM API
 * Implements proper authentication and error handling
 */
async function callNvidiaMolMIMAPI(params: {
  algorithm: string;
  smilesInput: string;
  numSamples: number;
  similarity: number;
}): Promise<{
  success: boolean;
  molecules?: Array<{
    smiles: string;
    similarity?: number;
    formula?: string;
    iupacName?: string;
  }>;
  error?: string;
}> {
  try {
    // Get API key from environment (server-side only)
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error('NVIDIA API key not configured');
    }

    const requestBody = {
      algorithm: params.algorithm,
      smilesInput: params.smilesInput,
      numSamples: params.numSamples,
      similarity: params.similarity,
      taskParameters: {
        temperature: 0.8,
        topK: 50,
        topP: 0.9,
      },
    };

    const response = await fetch('https://api.nvidia.com/v1/biology/mit/molmim/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API returned status ${response.status}`);
    }

    const data = await response.json();

    // Parse response and extract molecules
    const molecules = data.molecules?.map((mol: any) => ({
      smiles: mol.smiles || mol.SMILES,
      similarity: mol.similarity,
      formula: mol.formula || mol.molecularFormula,
      iupacName: mol.iupacName,
    })) || [];

    return {
      success: true,
      molecules,
    };
  } catch (error: any) {
    console.error('NVIDIA MolMIM API Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Rate limiting middleware for API calls
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

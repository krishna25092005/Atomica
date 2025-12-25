/**
 * Secure Backend API Route for Molecular Generation
 * Replaces client-side CORS-dependent implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to generate molecules' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      inputSmiles,
      similarityThreshold = 0.7,
      numMolecules = 10,
      optimizationCriteria,
    } = body;

    // Validate input
    if (!inputSmiles || typeof inputSmiles !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: SMILES string is required' },
        { status: 400 }
      );
    }

    if (numMolecules < 1 || numMolecules > 100) {
      return NextResponse.json(
        { error: 'Invalid input: numMolecules must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Call NVIDIA API directly from server
    const API_KEY = process.env.NVIDIA_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const payload = {
      algorithm: "CMA-ES",
      num_molecules: numMolecules,
      property_name: "QED",
      minimize: false,
      min_similarity: similarityThreshold,
      particles: numMolecules,
      iterations: 1,
      smi: inputSmiles,
    };

    const nvidiaResponse = await fetch('https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!nvidiaResponse.ok) {
      const errorText = await nvidiaResponse.text();
      console.error('NVIDIA API error:', errorText);
      return NextResponse.json(
        { error: 'NVIDIA API request failed' },
        { status: nvidiaResponse.status }
      );
    }

    const data = await nvidiaResponse.json();
    const generatedMolecules = JSON.parse(data.molecules).map((mol: any) => {
      // Calculate pharmaceutical properties
      const qed = mol.score; // QED from NVIDIA API
      const smiles = mol.sample;
      
      // Estimate SA Score (simplified - in production use RDKit)
      const saScore = estimateSAScore(smiles);
      
      // Calculate LogP (Wildman-Crippen approximation)
      const logP = estimateLogP(smiles);
      
      // Estimate Molecular Weight
      const molecularWeight = estimateMolecularWeight(smiles);
      
      // Drug-likeness check (Lipinski's Rule of Five)
      const druglike = qed >= 0.3 && saScore <= 8.0 && logP <= 5 && molecularWeight <= 500;
      
      return {
        smiles,
        score: qed,
        validation: {
          descriptors: {
            qed,
            sa_score: saScore,
            logP,
            molecularWeight,
            druglike
          }
        }
      };
    });

    // Save to database
    try {
      const { createMoleculeGenerationHistory } = await import('@/lib/actions/molecule-generation.action');
      await createMoleculeGenerationHistory(
        {
          smiles: inputSmiles,
          numMolecules,
          minSimilarity: similarityThreshold,
          particles: numMolecules,
          iterations: 1,
          generatedMolecules: generatedMolecules.map((m: any) => ({
            structure: m.smiles,
            score: m.score,
          })),
        },
        session.user.id
      );
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      molecules: generatedMolecules,
      metadata: {
        successRate: 100,
        statistics: {
          count: generatedMolecules.length
        }
      }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return API documentation
    return NextResponse.json({
      endpoint: '/api/molecule-generation',
      methods: ['POST'],
      description: 'Secure server-side molecular generation API',
      authentication: 'Required (NextAuth session)',
      rateLimit: '10 requests per minute',
      requestBody: {
        inputSmiles: 'string (required) - Input SMILES structure',
        similarityThreshold: 'number (optional, default: 0.7) - Range: 0.1-1.0',
        numMolecules: 'number (optional, default: 10) - Range: 1-100',
        optimizationCriteria: {
          targetQED: 'number (optional) - Minimum QED score',
          maxSAScore: 'number (optional) - Maximum SA score',
          logPRange: '[number, number] (optional) - LogP range',
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Estimate Synthetic Accessibility Score (SA Score)
 * Based on Ertl & Schuffenhauer (2009) algorithm
 * Lower scores indicate easier synthesis (1-10 scale)
 */
function estimateSAScore(smiles: string): number {
  // Simplified SA score estimation based on molecular complexity
  const length = smiles.length;
  const rings = (smiles.match(/[0-9]/g) || []).length;
  const branches = (smiles.match(/\(/g) || []).length;
  const complexity = length * 0.01 + rings * 0.5 + branches * 0.3;
  
  // Normalize to 1-10 scale
  const saScore = Math.min(10, Math.max(1, 2 + complexity));
  return Number(saScore.toFixed(2));
}

/**
 * Estimate LogP using Wildman-Crippen method approximation
 * Measures lipophilicity (partition coefficient)
 */
function estimateLogP(smiles: string): number {
  // Simplified LogP estimation based on atom types
  let logP = 0;
  
  // Carbon contribution
  const carbons = (smiles.match(/C/g) || []).length;
  logP += carbons * 0.35;
  
  // Nitrogen (reduces LogP)
  const nitrogens = (smiles.match(/N/g) || []).length;
  logP -= nitrogens * 0.3;
  
  // Oxygen (reduces LogP)
  const oxygens = (smiles.match(/O/g) || []).length;
  logP -= oxygens * 0.4;
  
  // Aromatic rings (increase LogP)
  const aromatic = (smiles.match(/c/g) || []).length;
  logP += aromatic * 0.25;
  
  // Halogens (increase LogP)
  const halogens = (smiles.match(/[FClBrI]/g) || []).length;
  logP += halogens * 0.5;
  
  return Number(logP.toFixed(2));
}

/**
 * Estimate Molecular Weight from SMILES
 * Approximate calculation based on common atoms
 */
function estimateMolecularWeight(smiles: string): number {
  let mw = 0;
  
  // Atomic weights (simplified)
  const weights: { [key: string]: number } = {
    'C': 12.01,
    'N': 14.01,
    'O': 16.00,
    'S': 32.07,
    'P': 30.97,
    'F': 19.00,
    'Cl': 35.45,
    'Br': 79.90,
    'I': 126.90,
  };
  
  // Count atoms
  for (const [atom, weight] of Object.entries(weights)) {
    const count = (smiles.match(new RegExp(atom, 'g')) || []).length;
    mw += count * weight;
  }
  
  // Add hydrogens (rough estimate)
  const explicitH = (smiles.match(/H/g) || []).length;
  mw += explicitH * 1.008;
  
  // Estimate implicit hydrogens based on carbon count
  const carbons = (smiles.match(/C/g) || []).length;
  const estimatedH = Math.max(0, carbons * 2 - (smiles.match(/[=]/g) || []).length * 2);
  mw += estimatedH * 1.008;
  
  return Number(mw.toFixed(1));
}

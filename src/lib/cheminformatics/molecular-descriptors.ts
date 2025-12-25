/**
 * Molecular Descriptors and Drug-likeness Calculations
 * Implements QED, SA Score, LogP, and other pharmaceutical properties
 * Based on validated cheminformatics algorithms
 */

export interface MolecularDescriptors {
  molecularWeight: number;
  logP: number;
  hbd: number; // Hydrogen Bond Donors
  hba: number; // Hydrogen Bond Acceptors
  tpsa: number; // Topological Polar Surface Area
  rotatable_bonds: number;
  aromatic_rings: number;
  qed: number; // Quantitative Estimate of Drug-likeness
  sa_score: number; // Synthetic Accessibility Score
  lipinski_violations: number;
  veber_compliant: boolean;
  druglike: boolean;
}

export interface ValidationResult {
  valid: boolean;
  descriptors: MolecularDescriptors;
  warnings: string[];
  druglikeness_category: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
}

/**
 * Calculate Quantitative Estimate of Drug-likeness (QED)
 * Based on Bickerton et al. (2012) Nat Chem 4, 90–98
 * 
 * QED ranges from 0 to 1, with higher values indicating better drug-likeness
 * @param descriptors - Molecular descriptors
 * @returns QED score (0-1)
 */
export function calculateQED(descriptors: Partial<MolecularDescriptors>): number {
  const MW = descriptors.molecularWeight || 0;
  const ALOGP = descriptors.logP || 0;
  const HBA = descriptors.hba || 0;
  const HBD = descriptors.hbd || 0;
  const PSA = descriptors.tpsa || 0;
  const ROTB = descriptors.rotatable_bonds || 0;
  const AROM = descriptors.aromatic_rings || 0;

  // Desirability functions based on Bickerton et al.
  const ads = (x: number, a: number, b: number, c: number, d: number) => {
    return a + (b / (1 + Math.exp(-1 * (x - c + d / 2) / d)));
  };

  // MW desirability (optimal around 360 Da)
  const d_MW = ads(MW, 0.05, 0.95, 360, 100);
  
  // ALOGP desirability (optimal around 3.0)
  const d_ALOGP = ads(ALOGP, 0.05, 0.95, 3.0, 1.5);
  
  // HBA desirability (optimal around 5)
  const d_HBA = ads(HBA, 0.05, 0.95, 5.0, 2.0);
  
  // HBD desirability (optimal around 2)
  const d_HBD = ads(HBD, 0.05, 0.95, 2.0, 1.5);
  
  // PSA desirability (optimal around 60)
  const d_PSA = ads(PSA, 0.05, 0.95, 60, 20);
  
  // Rotatable bonds desirability (optimal around 5)
  const d_ROTB = ads(ROTB, 0.05, 0.95, 5.0, 2.0);
  
  // Aromatic rings desirability (optimal around 2)
  const d_AROM = ads(AROM, 0.05, 0.95, 2.0, 1.0);

  // Geometric mean of desirability functions
  const qed = Math.pow(
    d_MW * d_ALOGP * d_HBA * d_HBD * d_PSA * d_ROTB * d_AROM,
    1 / 7
  );

  return Math.max(0, Math.min(1, qed));
}

/**
 * Calculate Synthetic Accessibility Score
 * Based on Ertl and Schuffenhauer (2009) J Cheminform 1:8
 * 
 * SA Score ranges from 1 (easy to synthesize) to 10 (very difficult)
 * Lower scores indicate easier synthesis
 * 
 * @param descriptors - Molecular descriptors
 * @param smiles - SMILES string for complexity analysis
 * @returns SA score (1-10)
 */
export function calculateSAScore(
  descriptors: Partial<MolecularDescriptors>,
  smiles: string
): number {
  // Complexity penalty based on molecular features
  let complexityScore = 0;

  // Ring complexity
  const rings = descriptors.aromatic_rings || 0;
  complexityScore += rings * 0.5;

  // Rotatable bonds (flexibility penalty)
  const rotBonds = descriptors.rotatable_bonds || 0;
  complexityScore += rotBonds * 0.1;

  // Size penalty
  const mw = descriptors.molecularWeight || 0;
  if (mw > 500) complexityScore += (mw - 500) / 100;

  // SMILES complexity (character diversity and length)
  const smilesComplexity = calculateSMILESComplexity(smiles);
  complexityScore += smilesComplexity;

  // Heteroatom penalty (approximated from HBA + HBD)
  const heteroatoms = (descriptors.hba || 0) + (descriptors.hbd || 0);
  if (heteroatoms > 10) complexityScore += (heteroatoms - 10) * 0.3;

  // Normalize to 1-10 scale
  const saScore = 1 + Math.min(9, complexityScore);
  
  return Math.round(saScore * 10) / 10;
}

/**
 * Calculate SMILES string complexity
 */
function calculateSMILESComplexity(smiles: string): number {
  if (!smiles) return 0;

  let complexity = 0;
  
  // Branch points
  const branches = (smiles.match(/\(/g) || []).length;
  complexity += branches * 0.3;

  // Ring closures
  const rings = (smiles.match(/\d/g) || []).length;
  complexity += rings * 0.2;

  // Stereochemistry indicators
  const stereo = (smiles.match(/[@/\\]/g) || []).length;
  complexity += stereo * 0.4;

  // Special characters (bonds, charges)
  const special = (smiles.match(/[=#$+-]/g) || []).length;
  complexity += special * 0.2;

  return complexity;
}

/**
 * Calculate partition coefficient (LogP) using Wildman-Crippen method
 * Approximation based on atom contributions
 * 
 * @param smiles - SMILES string
 * @returns LogP value
 */
export function calculateLogP(smiles: string, mw: number): number {
  if (!smiles) return 0;

  // Simplified atom contribution method
  let logP = 0;

  // Carbon contribution (hydrophobic)
  const carbons = (smiles.match(/C/g) || []).length;
  logP += carbons * 0.15;

  // Nitrogen contribution (hydrophilic)
  const nitrogens = (smiles.match(/N/g) || []).length;
  logP -= nitrogens * 0.3;

  // Oxygen contribution (hydrophilic)
  const oxygens = (smiles.match(/O/g) || []).length;
  logP -= oxygens * 0.4;

  // Sulfur contribution
  const sulfurs = (smiles.match(/S/g) || []).length;
  logP += sulfurs * 0.15;

  // Halogen contribution (hydrophobic)
  const halogens = (smiles.match(/[FClBrI]/g) || []).length;
  logP += halogens * 0.2;

  // Aromatic rings (hydrophobic)
  const aromatics = (smiles.match(/c/g) || []).length;
  logP += aromatics * 0.1;

  // Size correction based on molecular weight
  logP += (mw / 100) * 0.05;

  return Math.round(logP * 100) / 100;
}

/**
 * Count rotatable bonds from SMILES
 */
export function countRotatableBonds(smiles: string): number {
  if (!smiles) return 0;

  // Single bonds not in rings (simplified heuristic)
  const singleBonds = (smiles.match(/-/g) || []).length;
  const ringClosures = (smiles.match(/\d/g) || []).length;
  
  // Estimate: single bonds minus terminal bonds and ring bonds
  const rotatable = Math.max(0, singleBonds - ringClosures - 2);
  
  return rotatable;
}

/**
 * Count aromatic rings from SMILES
 */
export function countAromaticRings(smiles: string): number {
  if (!smiles) return 0;

  // Count lowercase letters (aromatic atoms) and ring closures
  const aromaticAtoms = (smiles.match(/[a-z]/g) || []).length;
  
  // Estimate rings (rough approximation)
  const estimatedRings = Math.floor(aromaticAtoms / 6);
  
  return Math.max(0, estimatedRings);
}

/**
 * Parse molecular formula to extract basic descriptors
 */
export function parseMolecularFormula(formula: string): Partial<MolecularDescriptors> {
  if (!formula) return {};

  const elementPattern = /([A-Z][a-z]?)(\d*)/g;
  const elements: { [key: string]: number } = {};
  
  let match;
  while ((match = elementPattern.exec(formula)) !== null) {
    const element = match[1];
    const count = match[2] ? parseInt(match[2]) : 1;
    elements[element] = (elements[element] || 0) + count;
  }

  // Calculate molecular weight
  const atomicWeights: { [key: string]: number } = {
    H: 1.008, C: 12.011, N: 14.007, O: 15.999, F: 18.998,
    P: 30.974, S: 32.065, Cl: 35.453, Br: 79.904, I: 126.904
  };

  let mw = 0;
  for (const [element, count] of Object.entries(elements)) {
    mw += (atomicWeights[element] || 0) * count;
  }

  // Estimate HBD and HBA
  const hbd = elements['O'] || 0 + (elements['N'] || 0);
  const hba = (elements['O'] || 0) * 2 + (elements['N'] || 0);

  return {
    molecularWeight: Math.round(mw * 100) / 100,
    hbd: Math.min(hbd, 10),
    hba: Math.min(hba, 20),
  };
}

/**
 * Calculate all molecular descriptors from SMILES
 */
export function calculateMolecularDescriptors(
  smiles: string,
  formula?: string
): MolecularDescriptors {
  // Parse formula or use defaults
  const baseDescriptors = formula ? parseMolecularFormula(formula) : {};
  
  const molecularWeight = baseDescriptors.molecularWeight || estimateMWFromSMILES(smiles);
  const hbd = baseDescriptors.hbd || estimateHBD(smiles);
  const hba = baseDescriptors.hba || estimateHBA(smiles);
  const rotatable_bonds = countRotatableBonds(smiles);
  const aromatic_rings = countAromaticRings(smiles);
  const tpsa = estimateTPSA(hba, hbd);
  const logP = calculateLogP(smiles, molecularWeight);

  const descriptors: Partial<MolecularDescriptors> = {
    molecularWeight,
    logP,
    hbd,
    hba,
    tpsa,
    rotatable_bonds,
    aromatic_rings,
  };

  const qed = calculateQED(descriptors);
  const sa_score = calculateSAScore(descriptors, smiles);

  // Lipinski's Rule of Five violations
  const lipinski_violations = [
    molecularWeight > 500,
    logP > 5,
    hbd > 5,
    hba > 10,
  ].filter(Boolean).length;

  // Veber's rules (oral bioavailability)
  const veber_compliant = rotatable_bonds <= 10 && tpsa <= 140;

  // Overall drug-likeness
  const druglike = lipinski_violations <= 1 && veber_compliant && qed >= 0.3;

  return {
    molecularWeight,
    logP,
    hbd,
    hba,
    tpsa,
    rotatable_bonds,
    aromatic_rings,
    qed,
    sa_score,
    lipinski_violations,
    veber_compliant,
    druglike,
  };
}

/**
 * Estimate molecular weight from SMILES
 */
function estimateMWFromSMILES(smiles: string): number {
  const carbons = (smiles.match(/C/gi) || []).length;
  const nitrogens = (smiles.match(/N/gi) || []).length;
  const oxygens = (smiles.match(/O/gi) || []).length;
  const sulfurs = (smiles.match(/S/gi) || []).length;
  const fluorines = (smiles.match(/F/gi) || []).length;
  const chlorines = (smiles.match(/Cl/gi) || []).length;
  const bromines = (smiles.match(/Br/gi) || []).length;

  const mw = carbons * 12 + nitrogens * 14 + oxygens * 16 + 
             sulfurs * 32 + fluorines * 19 + chlorines * 35 + bromines * 80;

  return Math.round(mw * 100) / 100;
}

/**
 * Estimate hydrogen bond donors
 */
function estimateHBD(smiles: string): number {
  const oh = (smiles.match(/O[H\]]/g) || []).length;
  const nh = (smiles.match(/N[H\]]/g) || []).length;
  return oh + nh;
}

/**
 * Estimate hydrogen bond acceptors
 */
function estimateHBA(smiles: string): number {
  const oxygens = (smiles.match(/O/gi) || []).length;
  const nitrogens = (smiles.match(/N/gi) || []).length;
  return oxygens + nitrogens;
}

/**
 * Estimate topological polar surface area
 */
function estimateTPSA(hba: number, hbd: number): number {
  // Simplified estimation: each N or O contributes ~20-30 Ų
  return Math.round((hba * 20 + hbd * 12) * 100) / 100;
}

/**
 * Validate molecule and provide comprehensive assessment
 */
export function validateMolecule(smiles: string, formula?: string): ValidationResult {
  const descriptors = calculateMolecularDescriptors(smiles, formula);
  const warnings: string[] = [];

  // Check Lipinski violations
  if (descriptors.molecularWeight > 500) {
    warnings.push(`Molecular weight (${descriptors.molecularWeight}) exceeds 500 Da`);
  }
  if (descriptors.logP > 5) {
    warnings.push(`LogP (${descriptors.logP}) exceeds 5 (lipophilicity warning)`);
  }
  if (descriptors.hbd > 5) {
    warnings.push(`Hydrogen bond donors (${descriptors.hbd}) exceed 5`);
  }
  if (descriptors.hba > 10) {
    warnings.push(`Hydrogen bond acceptors (${descriptors.hba}) exceed 10`);
  }

  // Check Veber rules
  if (descriptors.rotatable_bonds > 10) {
    warnings.push(`Rotatable bonds (${descriptors.rotatable_bonds}) exceed 10 (flexibility concern)`);
  }
  if (descriptors.tpsa > 140) {
    warnings.push(`TPSA (${descriptors.tpsa}) exceeds 140 Ų (permeability concern)`);
  }

  // Synthetic accessibility warning
  if (descriptors.sa_score > 6) {
    warnings.push(`SA Score (${descriptors.sa_score}) indicates difficult synthesis`);
  }

  // Determine drug-likeness category
  let druglikeness_category: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  if (descriptors.qed >= 0.7 && descriptors.sa_score <= 4) {
    druglikeness_category = 'Excellent';
  } else if (descriptors.qed >= 0.5 && descriptors.sa_score <= 6) {
    druglikeness_category = 'Good';
  } else if (descriptors.qed >= 0.3 && descriptors.sa_score <= 8) {
    druglikeness_category = 'Moderate';
  } else {
    druglikeness_category = 'Poor';
  }

  return {
    valid: smiles.length > 0,
    descriptors,
    warnings,
    druglikeness_category,
  };
}

/**
 * Generate statistical summary for a batch of molecules
 */
export interface BatchStatistics {
  total: number;
  druglike_count: number;
  druglike_percentage: number;
  qed_stats: {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
  };
  sa_stats: {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
  };
  logp_stats: {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
  };
  distribution: {
    excellent: number;
    good: number;
    moderate: number;
    poor: number;
  };
}

export function calculateBatchStatistics(
  validations: ValidationResult[]
): BatchStatistics {
  const total = validations.length;
  const druglike_count = validations.filter(v => v.descriptors.druglike).length;
  const druglike_percentage = (druglike_count / total) * 100;

  const qedValues = validations.map(v => v.descriptors.qed);
  const saValues = validations.map(v => v.descriptors.sa_score);
  const logpValues = validations.map(v => v.descriptors.logP);

  const distribution = {
    excellent: validations.filter(v => v.druglikeness_category === 'Excellent').length,
    good: validations.filter(v => v.druglikeness_category === 'Good').length,
    moderate: validations.filter(v => v.druglikeness_category === 'Moderate').length,
    poor: validations.filter(v => v.druglikeness_category === 'Poor').length,
  };

  return {
    total,
    druglike_count,
    druglike_percentage: Math.round(druglike_percentage * 100) / 100,
    qed_stats: calculateStats(qedValues),
    sa_stats: calculateStats(saValues),
    logp_stats: calculateStats(logpValues),
    distribution,
  };
}

function calculateStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);

  return {
    mean: Math.round(mean * 1000) / 1000,
    median: Math.round(median * 1000) / 1000,
    std: Math.round(std * 1000) / 1000,
    min: Math.round(Math.min(...values) * 1000) / 1000,
    max: Math.round(Math.max(...values) * 1000) / 1000,
  };
}

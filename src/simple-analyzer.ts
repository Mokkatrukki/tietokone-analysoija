import { HardwareSpecsDB } from './db/hardware-specs';
import { extractGpu } from './utils/gpuExtractor';
import { extractProcessor } from './utils/processorExtractor';
import { extractScreenType } from './utils/screenExtractor';
import { extractMemory } from './utils/memoryExtractor';
import { extractOs } from './utils/osExtractor';

export interface SimpleListingInput {
  url: string;
  title: string;
  specs: string;
  price: number | string;
}

export interface SimpleAnalysisResult {
  cpu: {
    name: string;
    score: string;
    rank: string;
  } | null;
  gpu: {
    name: string;
    score: string;
    rank: string;
    isIntegrated: boolean;
  } | null;
  screen: {
    type: string;
  } | null;
  os: {
    name: string;
  } | null;
  price: number;
  performance: {
    totalScore: number;
    cpuScore: number | null;
    gpuScore: number | null;
  };
  value: {
    totalPointsPerEuro: number;
    cpuPointsPerEuro: number | null;
    gpuPointsPerEuro: number | null;
  };
}

export async function analyzeSimpleListing(db: HardwareSpecsDB, input: SimpleListingInput): Promise<SimpleAnalysisResult | null> {
  // Extract CPU from title and specs
  const cpuFromSpecs = extractProcessor(input.specs);
  const cpuFromTitle = extractProcessor(input.title);
  const cpuModel = cpuFromSpecs || cpuFromTitle;

  // Get CPU details from database
  let cpuSpec = null;
  if (cpuModel) {
    cpuSpec = db.searchCpuSpecs(cpuModel);
  }

  // Extract GPU from title and specs
  const gpuFromSpecs = extractGpu(input.specs);
  const gpuFromTitle = extractGpu(input.title);
  let gpuModel = gpuFromSpecs || gpuFromTitle;
  
  // Get GPU details from database
  let gpuSpec = null;
  let isIntegratedGpu = false;

  if (gpuModel) {
    gpuSpec = db.searchGpuSpecs(gpuModel);
    isIntegratedGpu = gpuModel.toLowerCase().includes('with radeon graphics');
  } else if (cpuModel) {
    // If no discrete GPU found, try to find integrated GPU based on CPU
    const integratedGpuName = db.getIntegratedGpuForCpu(cpuModel);
    
    if (integratedGpuName) {
      gpuSpec = db.searchGpuSpecs(integratedGpuName);
      isIntegratedGpu = true;
    }
  }

  // Extract screen type
  const screenTypeFromTitle = extractScreenType(input.title);
  const screenTypeFromSpecs = extractScreenType(input.specs);
  const screenType = screenTypeFromTitle || screenTypeFromSpecs;

  // Extract OS information
  const osFromTitle = extractOs(input.title);
  const osFromSpecs = extractOs(input.specs);
  const osName = osFromTitle || osFromSpecs;

  // Calculate performance scores
  const cpuScoreNum = cpuSpec ? parseInt(cpuSpec.score.toString()) : null;
  const gpuScoreNum = gpuSpec ? parseInt(gpuSpec.score.toString()) : null;
  
  // Calculate total score
  let totalScore = 0;
  if (cpuScoreNum) totalScore += cpuScoreNum;
  if (gpuScoreNum) totalScore += gpuScoreNum;

  // Create performance object
  const performance = {
    totalScore: totalScore,
    cpuScore: cpuScoreNum,
    gpuScore: gpuScoreNum
  };

  // Parse and normalize price
  let priceEur: number;
  if (typeof input.price === 'string') {
    priceEur = parseFloat((input.price).replace(/[^\d.,]/g, '').replace(',', '.'));
  } else {
    priceEur = input.price;
  }

  // Calculate value metrics
  const totalPointsPerEuro = priceEur > 0 ? parseFloat((totalScore / priceEur).toFixed(2)) : 0;
  const cpuPointsPerEuro = cpuScoreNum && priceEur > 0 ? parseFloat((cpuScoreNum / priceEur).toFixed(2)) : null;
  const gpuPointsPerEuro = gpuScoreNum && priceEur > 0 ? parseFloat((gpuScoreNum / priceEur).toFixed(2)) : null;
  
  const value = {
    totalPointsPerEuro,
    cpuPointsPerEuro,
    gpuPointsPerEuro
  };

  return {
    cpu: cpuSpec ? {
      name: cpuSpec.name,
      score: cpuSpec.score.toString(),
      rank: cpuSpec.rank.toString()
    } : null,
    gpu: gpuSpec ? {
      name: gpuSpec.name,
      score: gpuSpec.score.toString(),
      rank: gpuSpec.rank.toString(),
      isIntegrated: isIntegratedGpu
    } : null,
    screen: screenType ? {
      type: screenType
    } : null,
    os: osName ? {
      name: osName
    } : null,
    price: priceEur,
    performance,
    value
  };
} 
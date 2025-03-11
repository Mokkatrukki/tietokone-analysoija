import { Database } from 'sqlite3';
import { ToriListing } from './types/ToriListing';
import { HardwareSpecsDB } from './db/hardware-specs';
import { extractGpu } from './utils/gpuExtractor';
import { extractProcessor } from './utils/processorExtractor';
import { isLaptopListing } from './utils/categoryUtils';
import { extractScreenType } from './utils/screenExtractor';
import { extractMemory } from './utils/memoryExtractor';
import { extractOs } from './utils/osExtractor';

interface AnalysisResult {
  cpu: {
    name: string;
    score: string;
    rank: string;
    source: {
      foundInDescription: boolean;
      foundInTitle: boolean;
    };
  } | null;
  gpu: {
    name: string;
    score: string;
    rank: string;
    source: {
      foundInTitle: boolean;
      foundInDescription: boolean;
      isIntegrated: boolean;
    };
  } | null;
  screen: {
    type: string;
    source: {
      foundInTitle: boolean;
      foundInDescription: boolean;
    };
  } | null;
  memory: {
    sizeGB: number;
    source: {
      foundInTitle: boolean;
      foundInDescription: boolean;
    };
  } | null;
  os: {
    name: string;
    source: {
      foundInTitle: boolean;
      foundInDescription: boolean;
    };
  } | null;
  performance: {
    totalScore: number;
    cpuScore: number | null;
    gpuScore: number | null;
  };
  value: {
    priceEur: number;
    totalPointsPerEuro: number;
    cpuPointsPerEuro: number | null;
    gpuPointsPerEuro: number | null;
  } | null;
}

/**
 * Checks if a GPU is integrated based on its name
 * @param gpuName - The name of the GPU to check
 * @returns True if the GPU is integrated, false otherwise
 */
function isIntegratedGpu(gpuName: string): boolean {
  const lowerName = gpuName.toLowerCase();
  return lowerName.includes('uhd graphics') || 
         lowerName.includes('with radeon graphics') || 
         lowerName.includes('integrated') ||
         lowerName.includes('iris');
}

export function analyzeListing(db: HardwareSpecsDB, listing: ToriListing): AnalysisResult | null {
  console.log(`Analyzing listing: ${listing.title}`);

  // Check if this is a laptop listing
  if (!isLaptopListing(listing)) {
    console.log('Not a laptop listing, skipping');
    return null;
  }

  console.log('Listing:', listing);
  // Extract CPU model from title and description
  const cpuFromDescription = extractProcessor(listing.description);
  const cpuFromTitle = extractProcessor(listing.title);
  console.log('CPU from description:', cpuFromDescription);
  console.log('CPU from title:', cpuFromTitle);

  console.log('Found CPU:', { fromDescription: cpuFromDescription, fromTitle: cpuFromTitle });

  // Search for CPU in database
  const cpuModel = cpuFromDescription || cpuFromTitle;
  if (!cpuModel) {
    console.log('No CPU model found');
    return null;
  }

  const cpuSpec = db.searchCpuSpecs(cpuModel);
  console.log('CPU database search result:', cpuSpec);

  if (!cpuSpec) {
    return null;
  }

  // Create CPU source info
  const cpuSource = {
    foundInDescription: cpuFromDescription !== null,
    foundInTitle: cpuFromTitle !== null
  };

  // Extract GPU model from title and description
  const gpuFromDescription = extractGpu(listing.description);
  const gpuFromTitle = extractGpu(listing.title);

  console.log('Found GPU:', { fromDescription: gpuFromDescription, fromTitle: gpuFromTitle });

  // Search for GPU in database
  let gpuSpec = null;
  let gpuSource = {
    foundInTitle: false,
    foundInDescription: false,
    isIntegrated: false
  };

  const gpuModel = gpuFromDescription || gpuFromTitle;

  if (gpuModel) {
    gpuSpec = db.searchGpuSpecs(gpuModel);
    gpuSource.foundInTitle = gpuFromTitle !== null;
    gpuSource.foundInDescription = gpuFromDescription !== null;
    gpuSource.isIntegrated = gpuModel.toLowerCase().includes('with radeon graphics');
  } else {
    // If no discrete GPU found, try to find integrated GPU based on CPU
    console.log('Looking for integrated GPU for CPU:', cpuModel);
    const integratedGpuName = db.getIntegratedGpuForCpu(cpuModel);
    
    if (integratedGpuName) {
      console.log('Found integrated GPU:', integratedGpuName);
      gpuSpec = db.searchGpuSpecs(integratedGpuName);
      gpuSource.isIntegrated = true;
      // For integrated GPUs found via CPU, we mark it as found in the same place as the CPU
      gpuSource.foundInTitle = cpuFromTitle !== null;
      gpuSource.foundInDescription = cpuFromDescription !== null;
    }
  }

  console.log('Analysis complete:', { cpu: cpuSpec, gpu: gpuSpec });

  // Calculate performance scores
  const cpuScoreNum = cpuSpec ? parseInt(cpuSpec.score.toString()) : null;
  const gpuScoreNum = gpuSpec ? parseInt(gpuSpec.score.toString()) : null;
  
  // Calculate total score - sum of CPU and GPU scores that are available
  let totalScore = 0;
  if (cpuScoreNum) totalScore += cpuScoreNum;
  if (gpuScoreNum) totalScore += gpuScoreNum;

  // Create performance object
  const performance = {
    totalScore: totalScore,
    cpuScore: cpuScoreNum,
    gpuScore: gpuScoreNum
  };

  // Calculate value metrics if price is available
  let value = null;
  if (listing.price) {
    // Convert price to number if it's a string
    const priceEur = typeof listing.price === 'string' 
      ? parseFloat((listing.price as string).replace(/[^\d.,]/g, '').replace(',', '.')) 
      : listing.price;
    
    // Only calculate if we have a valid number
    if (!isNaN(priceEur) && priceEur > 0) {
      // Calculate points per euro
      const totalPointsPerEuro = parseFloat((totalScore / priceEur).toFixed(2));
      const cpuPointsPerEuro = cpuScoreNum ? parseFloat((cpuScoreNum / priceEur).toFixed(2)) : null;
      const gpuPointsPerEuro = gpuScoreNum ? parseFloat((gpuScoreNum / priceEur).toFixed(2)) : null;
      
      value = {
        priceEur,
        totalPointsPerEuro,
        cpuPointsPerEuro,
        gpuPointsPerEuro
      };
    }
  }

  // Extract screen type information
  const screenTypeFromTitle = listing.title ? extractScreenType(listing.title) : null;
  const screenTypeFromDescription = extractScreenType(listing.description);
  const screenType = screenTypeFromTitle || screenTypeFromDescription;

  // Extract memory information
  const memoryFromTitle = listing.title ? extractMemory(listing.title) : null;
  const memoryFromDescription = extractMemory(listing.description);
  const memorySizeGB = memoryFromTitle || memoryFromDescription;

  // Create screen source information
  const screenSource = {
    foundInTitle: !!screenTypeFromTitle,
    foundInDescription: !!screenTypeFromDescription
  };

  // Create memory source information
  const memorySource = {
    foundInTitle: !!memoryFromTitle,
    foundInDescription: !!memoryFromDescription
  };

  // Extract OS information
  const osFromTitle = listing.title ? extractOs(listing.title) : null;
  const osFromDescription = extractOs(listing.description);
  const osName = osFromTitle || osFromDescription;

  // Create OS source information
  const osSource = {
    foundInTitle: !!osFromTitle,
    foundInDescription: !!osFromDescription
  };

  return {
    cpu: cpuSpec ? {
      name: cpuSpec.name,
      score: cpuSpec.score.toString(),
      rank: cpuSpec.rank.toString(),
      source: cpuSource
    } : null,
    gpu: gpuSpec ? {
      name: gpuSpec.name,
      score: gpuSpec.score.toString(),
      rank: gpuSpec.rank.toString(),
      source: gpuSource
    } : null,
    screen: screenType ? {
      type: screenType,
      source: screenSource
    } : null,
    memory: memorySizeGB ? {
      sizeGB: memorySizeGB,
      source: memorySource
    } : null,
    os: osName ? {
      name: osName,
      source: osSource
    } : null,
    performance,
    value
  };
} 
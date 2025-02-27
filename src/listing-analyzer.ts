import { Database } from 'sqlite3';
import { ToriListing } from './types/ToriListing';
import { HardwareSpecsDB } from './db/hardware-specs';
import { extractGpu } from './utils/gpuExtractor';
import { extractProcessor } from './utils/processorExtractor';
import { isLaptopListing } from './utils/categoryUtils';

interface AnalysisResult {
  cpu: {
    name: string;
    score: string;
    rank: string;
  } | null;
  gpu: {
    name: string;
    score: string;
    rank: string;
  } | null;
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

  // Extract GPU model from title and description
  const gpuFromDescription = extractGpu(listing.description);
  const gpuFromTitle = extractGpu(listing.title);

  console.log('Found GPU:', { fromDescription: gpuFromDescription, fromTitle: gpuFromTitle });

  // Search for GPU in database
  let gpuSpec = null;
  const gpuModel = gpuFromDescription || gpuFromTitle;

  if (gpuModel) {
    gpuSpec = db.searchGpuSpecs(gpuModel);
  } else {
    // If no discrete GPU found, try to find integrated GPU based on CPU
    console.log('Looking for integrated GPU for CPU:', cpuModel);
    const integratedGpuName = db.getIntegratedGpuForCpu(cpuModel);
    
    if (integratedGpuName) {
      console.log('Found integrated GPU:', integratedGpuName);
      gpuSpec = db.searchGpuSpecs(integratedGpuName);
    }
  }

  console.log('Analysis complete:', { cpu: cpuSpec, gpu: gpuSpec });

  return {
    cpu: cpuSpec ? {
      name: cpuSpec.name,
      score: cpuSpec.score.toString(),
      rank: cpuSpec.rank.toString()
    } : null,
    gpu: gpuSpec ? {
      name: gpuSpec.name,
      score: gpuSpec.score.toString(),
      rank: gpuSpec.rank.toString()
    } : null
  };
} 
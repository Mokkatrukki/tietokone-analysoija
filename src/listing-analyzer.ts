import { Database } from 'sqlite3';
import { ToriListing } from './types/ToriListing';
import { isLaptopListing } from './utils/categoryUtils';
import { searchCpuSpecs } from './db/cpu-specs';
import { searchGpuSpecs, getIntegratedGpuForCpu } from './db/gpu-specs';
import { extractProcessor } from './utils/processorExtractor';
import { extractGpu } from './utils/gpuExtractor';

export interface AnalyzerResult {
  cpu: {
    name: string | null;
    score: string | null;
    rank: string | null;
  };
  gpu: {
    name: string | null;
    score: string | null;
    rank: string | null;
  };
}

/**
 * Analyzes a Tori.fi listing to extract CPU and GPU information
 * 
 * Workflow:
 * 1. Check if listing is a laptop using categoryUtils.isLaptopListing
 *    - If not a laptop, return null
 * 
 * 2. Try to find CPU model from listing
 *    - First look in description for CPU model (i5 8250U)
 *    - If not found in description, look in title
 *    - If no CPU found, return null
 * 
 * 3. Search CPU from database
 *    - Use searchCpuSpecs to get CPU details (name, score, rank)
 *    - If CPU not found in database, return null
 * 
 * 4. Try to find discrete GPU first
 *    - Use extractGpu to find GPU from description
 *    - Use extractGpu to find GPU from title
 *    - If GPU found, search GPU specs from database
 * 
 * 5. Fall back to integrated GPU
 *    - Use getIntegratedGpuForCpu to find integrated GPU
 *    - Search GPU specs from database
 * 
 * 6. Return combined CPU and GPU information with benchmark scores
 */
export async function analyzeListing(db: Database, listing: ToriListing): Promise<AnalyzerResult> {
  console.log('Analyzing listing:', listing.title);

  const nullResult = {
    name: null,
    score: null,
    rank: null
  };

  // 1. Check if listing is a laptop
  if (!isLaptopListing(listing)) {
    console.log('Not a laptop listing, skipping');
    return { cpu: nullResult, gpu: nullResult };
  }

  // 2. Try to find CPU model from listing
  const cpuFromDescription = extractProcessor(listing.description);
  const cpuFromTitle = extractProcessor(listing.title);
  console.log('Found CPU:', { fromDescription: cpuFromDescription, fromTitle: cpuFromTitle });
  
  const cpuModel = cpuFromDescription || cpuFromTitle;
  if (!cpuModel) {
    console.log('No CPU model found');
    return { cpu: nullResult, gpu: nullResult };
  }

  // 3. Search CPU from database
  const cpu = await searchCpuSpecs(db, cpuModel);
  console.log('CPU database search result:', cpu);
  if (!cpu) {
    console.log('CPU not found in database');
    return { cpu: nullResult, gpu: nullResult };
  }

  // 4. Try to find discrete GPU first
  const gpuFromDescription = extractGpu(listing.description);
  const gpuFromTitle = extractGpu(listing.title);
  console.log('Found GPU:', { fromDescription: gpuFromDescription, fromTitle: gpuFromTitle });
  
  const discreteGpu = gpuFromDescription || gpuFromTitle;
  if (discreteGpu) {
    console.log('Searching for discrete GPU:', discreteGpu);
    const gpu = await searchGpuSpecs(db, discreteGpu);
    if (gpu) {
      console.log('Found discrete GPU in database');
      return { cpu, gpu };
    }
    console.log('Discrete GPU not found in database');
  }

  // 5. Fall back to integrated GPU
  console.log('Looking for integrated GPU for CPU:', cpuModel);
  const integratedGpuName = await getIntegratedGpuForCpu(db, cpuModel);
  if (!integratedGpuName) {
    console.log('No integrated GPU found for CPU');
    return { cpu, gpu: nullResult };
  }

  console.log('Found integrated GPU:', integratedGpuName);
  const gpu = await searchGpuSpecs(db, integratedGpuName);
  if (!gpu) {
    console.log('Integrated GPU not found in database');
    return { cpu, gpu: nullResult };
  }

  console.log('Analysis complete:', { cpu, gpu });
  return { cpu, gpu };
} 
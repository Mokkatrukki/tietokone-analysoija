import { Database } from 'sqlite3';
import { ToriListing } from './types/ToriListing';
import { HardwareSpecsDB } from './db/hardware-specs';

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

function extractCpuModel(text: string): string | null {
  // Common Intel CPU patterns
  const intelPatterns = [
    /i\d[\s-]+\d{4,}[A-Z]?[A-Z]?/i,  // i5-8250U, i7-1165G7
    /i\d[\s-]+\d{3}[A-Z]?[A-Z]?/i,   // i5-750, i7-860
  ];

  // Common AMD CPU patterns
  const amdPatterns = [
    /Ryzen\s+\d[\s-]+\d{4}[A-Z]?[A-Z]?/i,  // Ryzen 5 5600X, Ryzen 7 3700X
    /Ryzen\s+\d[\s-]+PRO\s+\d{4}[A-Z]?[A-Z]?/i  // Ryzen 5 PRO 4650U
  ];

  const patterns = [...intelPatterns, ...amdPatterns];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  return null;
}

function extractGpuModel(text: string): string | null {
  // Common discrete GPU patterns
  const patterns = [
    /GeForce[\s-]+(GTX|RTX)?[\s-]*\d{3,4}[\s-]*(Ti|Super)?/i,  // GeForce RTX 3080, GTX 1660 Ti
    /Radeon[\s-]+(RX|HD)?[\s-]*\d{3,4}[\s-]*(XT|M)?/i,  // Radeon RX 6800 XT
    /Intel[\s-]+(HD|UHD|Iris)[\s-]*Graphics[\s-]*\d*/i,  // Intel UHD Graphics 620
    /Intel[\s-]+Arc[\s-]*[A-Z]\d+/i  // Intel Arc A770
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  return null;
}

export async function analyzeListing(db: HardwareSpecsDB, listing: ToriListing): Promise<AnalysisResult | null> {
  console.log(`Analyzing listing: ${listing.title}`);

  // Check if this is a laptop listing
  if (!listing.categories?.full.toLowerCase().includes('kannettavat')) {
    console.log('Not a laptop listing, skipping');
    return null;
  }

  // Extract CPU model from title and description
  const cpuFromDescription = extractCpuModel(listing.description);
  const cpuFromTitle = extractCpuModel(listing.title);

  console.log('Found CPU:', { fromDescription: cpuFromDescription, fromTitle: cpuFromTitle });

  // Search for CPU in database
  const cpuModel = cpuFromDescription || cpuFromTitle;
  if (!cpuModel) {
    console.log('No CPU model found');
    return null;
  }

  const cpuSpec = await db.searchCpuSpecs(cpuModel);
  console.log('CPU database search result:', cpuSpec);

  if (!cpuSpec) {
    return null;
  }

  // Extract GPU model from title and description
  const gpuFromDescription = extractGpuModel(listing.description);
  const gpuFromTitle = extractGpuModel(listing.title);

  console.log('Found GPU:', { fromDescription: gpuFromDescription, fromTitle: gpuFromTitle });

  // Search for GPU in database
  let gpuSpec = null;
  const gpuModel = gpuFromDescription || gpuFromTitle;

  if (gpuModel) {
    gpuSpec = await db.searchGpuSpecs(gpuModel);
  } else {
    // If no discrete GPU found, try to find integrated GPU based on CPU
    console.log('Looking for integrated GPU for CPU:', cpuModel);
    const integratedGpuName = await db.getIntegratedGpuForCpu(cpuModel);
    
    if (integratedGpuName) {
      console.log('Found integrated GPU:', integratedGpuName);
      gpuSpec = await db.searchGpuSpecs(integratedGpuName);
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
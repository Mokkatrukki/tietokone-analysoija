/**
 * Extract GPU information from text
 * @param text The text to extract GPU information from
 * @returns The extracted GPU model or null if not found
 */
export function extractGpu(text: string): string | null {
  // Normalize text: remove extra spaces, convert to lowercase for matching
  const normalizedText = text.replace(/\s+/g, ' ').toLowerCase();

  // NVIDIA GPU patterns
  const nvidiaPatterns = [
    // RTX and GTX series with variations in spacing and casing
    /nvidia\s*ge(?:force)?\s*(rtx|gtx)\s*(\d{3,4})(?:\s*ti)?\b/i,
    /ge(?:force)?\s*(rtx|gtx)\s*(\d{3,4})(?:\s*ti)?\b/i
  ];

  // Try to match NVIDIA patterns
  for (const pattern of nvidiaPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Get the full GPU name from original text to preserve casing
      const gpuStart = text.indexOf(match[0]);
      const gpuEnd = gpuStart + match[0].length;
      const originalGpuText = text.slice(gpuStart, gpuEnd);
      
      // Normalize the GPU name format
      return originalGpuText
        .replace(/nvidia\s*/i, '')
        .replace(/\s+/g, ' ')
        .replace(/geforce/i, 'GeForce')
        .replace(/rtx/i, 'RTX')
        .replace(/gtx/i, 'GTX')
        .trim();
    }
  }

  // AMD integrated graphics pattern
  const amdIntegratedPattern = /radeon\s*graphics\b/i;
  const amdMatch = normalizedText.match(amdIntegratedPattern);
  if (amdMatch) {
    return 'Radeon Graphics';
  }

  // Intel integrated graphics pattern
  const intelPattern = /intel\s*(uhd|iris\s*xe)\s*graphics\b/i;
  const intelMatch = text.match(intelPattern);
  if (intelMatch) {
    // Normalize Intel GPU names
    const gpuName = intelMatch[0].replace(/\s+/g, ' ').trim();
    if (gpuName.toLowerCase().includes('iris xe')) {
      return 'Intel Iris Xe Graphics';
    }
    return gpuName;
  }

  return null;
} 
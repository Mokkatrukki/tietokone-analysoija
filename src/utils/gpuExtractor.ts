/**
 * Extracts GPU model information from a text description.
 * Handles both discrete NVIDIA GPUs (GeForce and Quadro) and AMD integrated graphics.
 * @param description - The text description to extract GPU information from
 * @returns The extracted GPU model name or null if not found
 */
export function extractGpu(description: string): string | null {
  // Regular expression to match NVIDIA GeForce GPU models (with optional GeForce prefix)
  const nvidiaGeforceRegex = /(?:nvidia\s+)?(?:geforce\s+)?(?:rtx|gtx)\s*\d{3,4}(?:\s+(?:ti|super))?/i;
  
  // Regular expression to match NVIDIA Quadro GPU models
  const nvidiaQuadroRegex = /(?:nvidia\s+)?quadro\s+(?:p|t|rtx|m)\d{3,4}(?:\s+(?:max-q))?/i;
  
  // Regular expression to match AMD Ryzen with integrated graphics
  // This pattern matches Ryzen [3,5,7,9] [PRO] model with Radeon Graphics
  const amdIntegratedRegex = /Ryzen\s+[3579](?:\s+PRO)?\s+\d{4,5}[A-Z]*U?(?:\s+with\s+Radeon\s+Graphics)/i;

  // Try NVIDIA GeForce, then Quadro, then AMD integrated
  const match = description.match(nvidiaGeforceRegex) || 
                description.match(nvidiaQuadroRegex) || 
                description.match(amdIntegratedRegex);
  
  if (!match) {
    return null;
  }

  const gpu = match[0];
  
  // If it's a NVIDIA GeForce GPU or standalone RTX/GTX, format it accordingly
  if (gpu.toLowerCase().includes('geforce') || /^(?:nvidia\s+)?(?:rtx|gtx)/i.test(gpu)) {
    return gpu
    .replace(/^Nvidia\s+/i, '') // Remove NVIDIA prefix
    .replace(/(\b(?:rtx|gtx))(\d{3,4})/i, (_, prefix, numbers) => `${prefix.toUpperCase()} ${numbers}`); // Format RTX/GTX and ensure space
  }
  
  // If it's a NVIDIA Quadro GPU, format it accordingly
  if (gpu.toLowerCase().includes('quadro')) {
    return gpu.replace(/\b\w+\b/g, word => {
      const lower = word.toLowerCase();
      if (lower === 'quadro') return 'Quadro';
      if (lower === 'rtx') return 'RTX';
      if (lower === 'max-q') return 'Max-Q';
      // Keep P, T, M series designators uppercase
      if (/^[ptm]\d{3,4}$/i.test(lower)) {
        return word.charAt(0).toUpperCase() + word.slice(1).toUpperCase();
      }
      return word;
    }).replace(/^Nvidia\s+/i, '');
  }
  
  // For AMD integrated graphics, return as is to preserve the exact format
  return gpu;
} 
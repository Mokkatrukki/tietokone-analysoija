/**
 * Extracts GPU model information from a text description.
 * Handles both discrete NVIDIA GPUs and AMD integrated graphics.
 * @param description - The text description to extract GPU information from
 * @returns The extracted GPU model name or null if not found
 */
export function extractGpu(description: string): string | null {
  // Regular expression to match NVIDIA GPU models
  const nvidiaRegex = /(?:nvidia\s+)?geforce\s+(?:rtx|gtx)\s+\d{3,4}(?:\s+(?:ti|super))?/i;
  
  // Regular expression to match AMD Ryzen with integrated graphics
  // This pattern matches Ryzen [3,5,7,9] [PRO] model with Radeon Graphics
  const amdIntegratedRegex = /Ryzen\s+[3579](?:\s+PRO)?\s+\d{4,5}[A-Z]*U?(?:\s+with\s+Radeon\s+Graphics)/i;

  // Try NVIDIA first, then AMD integrated
  const match = description.match(nvidiaRegex) || description.match(amdIntegratedRegex);
  
  if (!match) {
    return null;
  }

  const gpu = match[0];
  
  // If it's a NVIDIA GPU, format it accordingly
  if (gpu.toLowerCase().includes('geforce')) {
    return gpu.replace(/\b\w+\b/g, word => {
      const lower = word.toLowerCase();
      if (lower === 'rtx' || lower === 'gtx') return word.toUpperCase();
      if (lower === 'geforce') return 'GeForce';
      if (lower === 'ti') return 'Ti';
      if (lower === 'super') return 'SUPER';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).replace(/^Nvidia\s+/i, '');
  }
  
  // For AMD integrated graphics, return as is to preserve the exact format
  return gpu;
} 
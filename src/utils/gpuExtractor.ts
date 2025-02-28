/**
 * Extracts GPU model information from a text description.
 * Handles both discrete NVIDIA GPUs (GeForce and Quadro) and AMD integrated graphics.
 * @param description - The text description to extract GPU information from
 * @returns The extracted GPU model name or null if not found
 */
export function extractGpu(description: string): string | null {
  // 1. Exact patterns - try these first
  
  // AMD Ryzen integrated graphics
  const amdIntegratedRegex = /\bRyzen\s+[3579](?:\s+PRO)?\s+\d{4,5}[A-Z]*U?(?:\s+with\s+Radeon\s+Graphics)\b/i;
  
  // Complete Radeon patterns (well-formatted)
  const radeonCompleteRegex = /\b(?:AMD\s+)?Radeon\s+(?:RX\s+(?:7900(?:\s+(?:XTX|XT)|M)|7800\s+XT|6950\s+XT|6800\s+XT)|PRO\s+W[57][79]00)\b/i;
  
  // NVIDIA complete patterns
  const nvidiaGeforceRegex = /\b(?:nvidia\s+)?(?:GeForce\s+)?(?:RTX\s+(?:50(?:90|80|70)|40(?:90|80|70|60)|30(?:90|80|70|60)|20(?:80|70|60))(?:\s+(?:Ti|SUPER|D))?|GTX\s+(?:1080|1070|1650)(?:\s+Ti)?)\b/i;
  const nvidiaQuadroRegex = /\b(?:nvidia\s+)?quadro\s+(?:p|t|rtx|m)\d{3,4}(?:\s+(?:max-q))?\b/i;

  // 2. Repair patterns - try these if exact patterns don't match
  const radeonRepairRegex = /\b(?:rx\s*(\d{3,4})\s*(?:xt|xtx)?|rx(\d{3,4})(?:xt|xtx)?)\b/i;
  const nvidiaRepairRegex = /\b(?:rtx|gtx)\s*(\d{3,4})(?:\s*ti)?\b/i;

  // Try exact patterns first
  const match = description.match(amdIntegratedRegex) ||
                description.match(radeonCompleteRegex) ||
                description.match(nvidiaGeforceRegex) ||
                description.match(nvidiaQuadroRegex) ||
                description.match(radeonRepairRegex) ||
                description.match(nvidiaRepairRegex);

  if (!match) {
    return null;
  }

  const gpu = match[0];

  // If it's AMD integrated graphics, return as is
  if (gpu.toLowerCase().includes('with radeon graphics')) {
    return gpu;
  }

  // If it's a NVIDIA GeForce GPU or standalone RTX/GTX, format it accordingly
  if (gpu.toLowerCase().includes('geforce') || /\b(?:rtx|gtx)/i.test(gpu)) {
    let formatted = gpu
      .replace(/^nvidia\s+/i, '')
      .replace(/\b(geforce)\b/i, 'GeForce')
      .replace(/\b(rtx|gtx)\b/i, (match) => match.toUpperCase())
      .replace(/\b(ti)\b/i, 'Ti')
      .replace(/\b(super)\b/i, 'SUPER')
      .replace(/(\b(?:RTX|GTX))(\d{3,4})/i, '$1 $2')
      .replace(/(\d{3,4})(\s*Ti|\s*SUPER)/i, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    // Add GeForce prefix if missing
    if (!formatted.toLowerCase().startsWith('geforce')) {
      formatted = `GeForce ${formatted}`;
    }

    return formatted;
  }

  // If it's a NVIDIA Quadro GPU, format it accordingly
  if (gpu.toLowerCase().includes('quadro')) {
    return gpu
      .replace(/^nvidia\s+/i, '')
      .replace(/\b(quadro)\b/i, 'Quadro')
      .replace(/\b(rtx)\b/i, 'RTX')
      .replace(/\b(max-q)\b/i, 'Max-Q')
      .replace(/\b([ptm])(\d{3,4})\b/i, (_, prefix, numbers) => `${prefix.toUpperCase()}${numbers}`)
      .replace(/\s+/g, ' ')
      .trim();
  }

  // If it's a complete Radeon pattern, just normalize the format
  if (gpu.toLowerCase().includes('radeon')) {
    return gpu
      .replace(/^amd\s+/i, '')
      .replace(/\b(radeon)\b/i, 'Radeon')
      .replace(/\b(rx)\b/i, 'RX')
      .replace(/\b(pro)\b/i, 'PRO')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // If it's a short Radeon pattern that needs repair
  if (/\brx/i.test(gpu)) {
    let formatted = gpu
      .replace(/^rx\s*/i, 'RX ') // Add space after RX if not present
      .replace(/(\d{3,4})(xt|xtx)/i, '$1 $2') // Add space between number and XT/XTX
      .replace(/\b(xt|xtx)\b/i, match => match.toUpperCase()) // Uppercase XT/XTX
      .replace(/\s+/g, ' ')
      .trim();

    return `Radeon ${formatted}`;
  }

  return gpu;
} 
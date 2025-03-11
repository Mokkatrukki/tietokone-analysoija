/**
 * Extracts RAM size information from a text description.
 * Handles various formats like "16GB RAM", "8 GB", "16GB DDR4", etc.
 * Also handles Finnish notation "8 Gt muistia"
 * @param description - The text description to extract RAM size information from
 * @returns The extracted RAM size in GB as a number, or null if not found
 */
export function extractMemory(description: string): number | null {
  // Normalize the description for easier matching
  const normalizedDesc = description.toLowerCase();
  
  // Pattern for RAM size with explicit RAM/memory keyword
  // This handles patterns like "16GB RAM", "8 GB RAM", "16GB DDR4", "8 Gt muistia"
  const ramWithKeywordRegex = /(\d+)\s*(?:gb|g|gt)\s*(?:ram|memory|muisti|ddr\d*)/i;
  
  // Pattern for RAM size in a context that suggests it's RAM
  // This handles patterns like "upgraded to 16GB", "with 8GB of RAM"
  const contextualRamRegex = /(?:with|has|upgraded|to|from|memory:?|ram:?|muisti:?)\s*(\d+)\s*(?:gb|g|gt)/i;
  
  // Pattern for RAM size in a label-value format
  // This handles patterns like "Muisti: 8 Gt", "Memory: 16GB"
  const labelValueRamRegex = /(?:muisti|memory|ram):\s*(\d+)\s*(?:gb|g|gt)/i;
  
  // Pattern for RAM size in parentheses with RAM keyword
  // This handles patterns like "(16GB RAM, 512GB SSD)"
  const parenthesesRamRegex = /\(\s*(?:[^()]*\s+)?(\d+)\s*(?:gb|g|gt)\s*(?:ram|memory|muisti|ddr\d*)/i;
  
  // Pattern for RAM size as a standalone value in a list
  // This is more restrictive to avoid matching storage sizes
  // Looks for RAM size at the beginning of a list item or after a comma
  const listItemRamRegex = /(?:^|,|\n|\s+)\s*(\d+)\s*(?:gb|g|gt)(?:\s*(?:ram|memory|muisti|ddr\d*)|(?=\s*[,\/]|$))/i;
  
  // Pattern for RAM size in a title format
  // This handles patterns like "16GB/512GB" in titles
  const titleFormatRegex = /(\d+)\s*(?:gb|g|gt)\s*\/\s*\d+\s*(?:gb|g|gt)/i;
  
  // Special case: exclude storage patterns
  // This helps avoid matching storage sizes like "512GB SSD"
  const storagePatterns = [
    /\d+\s*(?:gb|g|gt)\s*(?:ssd|hdd|nvme|storage|hard\s*drive)/i,
    /\d+\s*(?:tb|t|tt)\s*(?:ssd|hdd|nvme|storage|hard\s*drive)?/i
  ];
  
  // Check if the text contains storage patterns
  const hasStoragePattern = storagePatterns.some(pattern => pattern.test(normalizedDesc));
  
  // Find all matches from all patterns
  let matches: RegExpMatchArray[] = [];
  
  // First try the most specific patterns that are clearly about RAM
  const keywordMatches = [
    ...Array.from(normalizedDesc.matchAll(new RegExp(ramWithKeywordRegex, 'gi'))),
    ...Array.from(normalizedDesc.matchAll(new RegExp(labelValueRamRegex, 'gi')))
  ];
  
  if (keywordMatches.length > 0) {
    matches = keywordMatches;
  } else {
    // If no explicit RAM keyword matches, try the other patterns
    matches = [
      ...Array.from(normalizedDesc.matchAll(new RegExp(contextualRamRegex, 'gi'))),
      ...Array.from(normalizedDesc.matchAll(new RegExp(parenthesesRamRegex, 'gi'))),
      ...Array.from(normalizedDesc.matchAll(new RegExp(listItemRamRegex, 'gi'))),
      ...Array.from(normalizedDesc.matchAll(new RegExp(titleFormatRegex, 'gi')))
    ];
  }
  
  if (matches.length === 0) {
    return null;
  }
  
  // Extract all RAM sizes found
  const ramSizes = matches.map(match => parseInt(match[1], 10))
                          .filter(size => !isNaN(size));
  
  if (ramSizes.length === 0) {
    return null;
  }
  
  // If we have storage patterns and no explicit RAM keyword,
  // we need to be more careful about which sizes we consider as RAM
  if (hasStoragePattern && keywordMatches.length === 0) {
    // Common RAM sizes (in GB)
    const commonRamSizes = [2, 4, 8, 16, 32, 64, 128];
    
    // Filter for common RAM sizes
    const likelyRamSizes = ramSizes.filter(size => commonRamSizes.includes(size));
    
    if (likelyRamSizes.length > 0) {
      return Math.max(...likelyRamSizes);
    }
    
    // If we have a storage pattern like "512GB SSD" and no explicit RAM mention,
    // and the size is not a common RAM size, it's likely not RAM
    if (normalizedDesc.includes('ssd') || normalizedDesc.includes('hdd')) {
      // Check if the size is more likely to be storage (larger sizes)
      const largeSize = Math.max(...ramSizes);
      if (largeSize > 128) {
        // This is likely a storage size, not RAM
        return null;
      }
    }
  }
  
  // Return the largest RAM size found
  // This handles cases where there might be multiple mentions
  // (e.g., "upgraded from 8GB to 16GB")
  return Math.max(...ramSizes);
} 
/**
 * Extracts operating system information from a text description.
 * Handles various formats like "Windows 10", "Windows 11 Pro", "Win10", "Linux", etc.
 * @param description - The text description to extract OS information from
 * @returns The extracted OS as a string, or null if not found
 */
export function extractOs(description: string): string | null {
  // Normalize the description for easier matching
  const normalizedDesc = description.toLowerCase();
  
  // Windows patterns
  const windows11Patterns = [
    /win(?:d?o?w?s)?\s*11(?:\s*pro)?/i,
    /käyttöjärjestelmä:?\s*win(?:d?o?w?s)?\s*11(?:\s*pro)?/i,
    /win(?:d?o?w?s)?\s*11(?:\s*pro)?\s*käyttöjärjestelmä/i
  ];
  
  const windows10Patterns = [
    /win(?:d?o?w?s)?\s*10(?:\s*pro)?/i,
    /käyttöjärjestelmä:?\s*win(?:d?o?w?s)?\s*10(?:\s*pro)?/i,
    /win(?:d?o?w?s)?\s*10(?:\s*pro)?\s*käyttöjärjestelmä/i
  ];
  
  // Linux patterns
  const linuxPatterns = [
    /linux(?:\s*\w+)?/i,
    /ubuntu/i,
    /debian/i,
    /fedora/i,
    /mint/i,
    /käyttöjärjestelmä:?\s*linux(?:\s*\w+)?/i
  ];
  
  // Chrome OS patterns
  const chromeOsPatterns = [
    /chrome\s*os/i,
    /chromebook/i,
    /käyttöjärjestelmä:?\s*chrome\s*os/i
  ];
  
  // macOS patterns
  const macOsPatterns = [
    /mac\s*os(?:\s*\w+)?/i,
    /macos/i,
    /osx/i,
    /os\s*x/i,
    /käyttöjärjestelmä:?\s*mac\s*os(?:\s*\w+)?/i
  ];
  
  // Check for Windows 11
  for (const pattern of windows11Patterns) {
    const match = normalizedDesc.match(pattern);
    if (match) {
      // Check if it's Pro version
      if (match[0].toLowerCase().includes('pro')) {
        return 'Windows 11 Pro';
      }
      return 'Windows 11';
    }
  }
  
  // Check for Windows 10
  for (const pattern of windows10Patterns) {
    const match = normalizedDesc.match(pattern);
    if (match) {
      // Check if it's Pro version
      if (match[0].toLowerCase().includes('pro')) {
        return 'Windows 10 Pro';
      }
      return 'Windows 10';
    }
  }
  
  // Check for Linux
  for (const pattern of linuxPatterns) {
    const match = normalizedDesc.match(pattern);
    if (match) {
      // Try to extract the specific Linux distribution
      const fullMatch = match[0].toLowerCase();
      if (fullMatch.includes('ubuntu')) {
        return 'Linux (Ubuntu)';
      } else if (fullMatch.includes('debian')) {
        return 'Linux (Debian)';
      } else if (fullMatch.includes('mint')) {
        return 'Linux (Mint)';
      } else if (fullMatch.includes('fedora')) {
        return 'Linux (Fedora)';
      }
      return 'Linux';
    }
  }
  
  // Check for Chrome OS
  for (const pattern of chromeOsPatterns) {
    if (pattern.test(normalizedDesc)) {
      return 'Chrome OS';
    }
  }
  
  // Check for macOS
  for (const pattern of macOsPatterns) {
    if (pattern.test(normalizedDesc)) {
      return 'macOS';
    }
  }
  
  return null;
} 
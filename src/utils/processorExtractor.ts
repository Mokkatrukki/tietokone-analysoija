export function extractIntelProcessor(description: string): string | null {
  // Try to match both formats: i5-2540M and i5 2540M
  const intelRegex = /i[3579][\s-]\d{4,5}[A-Z]?U?/i;
  const match = description.match(intelRegex);
  
  if (!match) return null;
  
  // Replace space with hyphen if found
  return match[0].replace(/\s/, '-');
} 
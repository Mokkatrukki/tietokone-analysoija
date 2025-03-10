export function extractProcessor(description: string): string | null {
  // Try to match Intel formats: i5-2540M and i5 2540M
  const intelRegex = /i[3579][\s-]\d{4,5}[A-Z]?U?/i;
  
  // Try to match Intel Core format: Core i5@8250U
  const intelCoreRegex = /Core\s+i[3579]@\d{4,5}[A-Z]?U?/i;
  
  // Try to match AMD Ryzen format: Ryzen 3 Pro 4450U, Ryzen 5 3600, Ryzen 7 5800X
  const ryzenRegex = /Ryzen\s[3579](?:\sPro)?\s\d{4}[A-Z]?U?/i;
  
  // Try to match AMD EPYC format: EPYC 7763, EPYC 9654
  const epycRegex = /EPYC\s\d{4}/i;
  
  // Try each regex in order
  const match = description.match(intelRegex) || 
                description.match(intelCoreRegex) ||
                description.match(ryzenRegex) || 
                description.match(epycRegex);
  
  if (!match) return null;
  
  // Replace space with hyphen for Intel processors only
  if (match[0].toLowerCase().startsWith('i')) {
    return match[0].replace(/\s/, '-');
  }
  
  // Replace @ with - for Intel Core processors
  if (match[0].toLowerCase().startsWith('core')) {
    return match[0].replace(/@/, '-');
  }
  
  return match[0];
} 
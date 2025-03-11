/**
 * Extracts screen type information from a text description.
 * Handles common screen types like IPS, TN, and OLED/AMOLED.
 * @param description - The text description to extract screen type information from
 * @returns The extracted screen type or null if not found
 */
export function extractScreenType(description: string): string | null {
  // Normalize the description for easier matching
  const normalizedDesc = description.toLowerCase();
  
  // 1. OLED patterns (highest priority)
  // OLED and AMOLED are considered the same category for our purposes
  const oledRegex = /\b(?:oled|amoled|super\s*amoled)\b/i;
  
  // 2. IPS patterns
  const ipsRegex = /\b(?:ips)(?:[-\s](?:n[aä]ytt[oö]|paneeli|panel|lcd|display))?\b/i;
  
  // 3. TN patterns
  const tnRegex = /\b(?:tn)(?:[-\s](?:n[aä]ytt[oö]|paneeli|panel|lcd|display))?\b/i;
  
  // Check for matches in priority order (OLED > IPS > TN)
  if (oledRegex.test(normalizedDesc)) {
    return 'OLED';
  }
  
  if (ipsRegex.test(normalizedDesc)) {
    return 'IPS';
  }
  
  if (tnRegex.test(normalizedDesc)) {
    return 'TN';
  }
  
  // No screen type found
  return null;
} 
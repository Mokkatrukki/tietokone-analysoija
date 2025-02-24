import { ToriListing } from '../types/ToriListing';

/**
 * Helper function to remove fields from test data
 * @param data Original test data
 * @param paths Array of dot notation paths to remove (e.g., ['categories.full', 'price'])
 * @returns A new object with specified fields removed
 */
export function removeFields<T>(data: T, paths: string[]): Partial<T> {
  const result = JSON.parse(JSON.stringify(data));
  
  for (const path of paths) {
    const parts = path.split('.');
    let current: any = result;
    
    // Navigate to the parent object
    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] === undefined) break;
      current = current[parts[i]];
    }
    
    // Remove the field if it exists
    if (current && typeof current === 'object') {
      delete current[parts[parts.length - 1]];
    }
  }
  
  return result;
}

export const minimalValidListing: ToriListing = {
  id: "12345",
  url: "https://www.tori.fi/item/12345",
  title: "Minimal Valid Item",
  price: 100,
  type: "myydään",
  description: "Minimal valid description",
  categories: {
    full: "Ajoneuvot > Autot > Volvo",
    levels: ["Ajoneuvot", "Autot", "Volvo"],
    primary: "Ajoneuvot",
    secondary: "Autot",
    tertiary: "Volvo"
  }
};

export const testListing: ToriListing = {
  ...minimalValidListing,
  id: "2313123",
  url: "https://www.tori.fi/recommerce/forsale/item/12313123",
  title: "Test Laptop",
  categories: {
    full: "Tori / Elektroniikka ja kodinkoneet / Tietotekniikka / Kannettavat tietokoneet",
    levels: [
      "Tori",
      "Elektroniikka ja kodinkoneet",
      "Tietotekniikka",
      "Kannettavat tietokoneet"
    ],
    primary: "Elektroniikka ja kodinkoneet",
    secondary: "Tietotekniikka",
    tertiary: "Kannettavat tietokoneet"
  },
  address: "33720, Tampere, Hervanta, Pirkanmaa",
  sellerType: "yksityinen",
  errors: []
};

import { ToriListing } from '../types/ToriListing';

/**
 * Check if a listing is a computer (laptop or desktop)
 * @param listing The Tori listing to check
 * @returns true if the listing is a laptop or desktop computer, false otherwise
 */
export function isComputerListing(listing: ToriListing): boolean {
  return isLaptopListing(listing) || isDesktopListing(listing);
}

/**
 * Check if a listing is a laptop
 * @param listing The Tori listing to check
 * @returns true if the listing is a laptop, false otherwise
 */
export function isLaptopListing(listing: ToriListing): boolean {
  // Return false if categories or levels is missing
  if (!listing.categories?.levels) {
    return false;
  }

  const { levels } = listing.categories;
  
  return levels.includes('Elektroniikka ja kodinkoneet') && 
         levels.includes('Tietotekniikka') &&
         levels.includes('Kannettavat tietokoneet');
}

/**
 * Check if a listing is a desktop computer
 * @param listing The Tori listing to check
 * @returns true if the listing is a desktop computer, false otherwise
 */
export function isDesktopListing(listing: ToriListing): boolean {
  // Return false if categories or levels is missing
  if (!listing.categories?.levels) {
    return false;
  }

  const { levels } = listing.categories;
  
  return levels.includes('Elektroniikka ja kodinkoneet') && 
         levels.includes('Tietotekniikka') &&
         levels.includes('Pöytäkoneet');
}

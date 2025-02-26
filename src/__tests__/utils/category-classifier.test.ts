import { laptopListing, desktopListing, otherListing, nonComputerListing } from '../../test/categoryTestData';
import { isComputerListing, isLaptopListing, isDesktopListing } from '../../utils/categoryUtils';

/* 
Check if listing belongs to computer category (Elektroniikka ja kodinkoneet > Tietotekniikka) and is either:
- Laptop (Kannettavat tietokoneet)
- Desktop (Pöytäkoneet)

These functions are used to trigger specific analysis for computer listings.
*/

describe('Category Utils', () => {
  describe('isComputerListing', () => {
    it('should return true for laptop listings', () => {
      expect(isComputerListing(laptopListing)).toBe(true);
    });

    it('should return true for desktop listings', () => {
      expect(isComputerListing(desktopListing)).toBe(true);
    });

    it('should return false for other computer related items', () => {
      expect(isComputerListing(otherListing)).toBe(false);
    });

    it('should return false for non-computer listings', () => {
      expect(isComputerListing(nonComputerListing)).toBe(false);
    });
  });

  describe('isLaptopListing', () => {
    it('should return true for laptop listings', () => {
      expect(isLaptopListing(laptopListing)).toBe(true);
    });

    it('should return false for desktop listings', () => {
      expect(isLaptopListing(desktopListing)).toBe(false);
    });
  });

  describe('isDesktopListing', () => {
    it('should return true for desktop listings', () => {
      expect(isDesktopListing(desktopListing)).toBe(true);
    });

    it('should return false for laptop listings', () => {
      expect(isDesktopListing(laptopListing)).toBe(false);
    });
  });
});
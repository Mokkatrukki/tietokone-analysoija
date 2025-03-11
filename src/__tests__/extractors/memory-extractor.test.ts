import { extractMemory } from '../../utils/memoryExtractor';

describe('Memory Information Extraction', () => {
  describe('Description Memory Extraction - Common Patterns', () => {
    it('should extract 16GB from standard format', () => {
      const description = "Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 16GB RAM, 512GB SSD. IPS-näyttö.";
      expect(extractMemory(description)).toBe(16);
    });

    it('should extract 8GB from format with space', () => {
      const description = "HP EliteBook 840 G5, Intel Core i5-8350U, 8 GB RAM, 256GB SSD, Windows 10 Pro";
      expect(extractMemory(description)).toBe(8);
    });

    it('should extract 32GB from format without RAM keyword', () => {
      const description = "Dell XPS 15, Intel Core i7-10750H, 32GB, 1TB SSD, NVIDIA GTX 1650 Ti, 4K OLED";
      expect(extractMemory(description)).toBe(32);
    });

    it('should extract 4GB from format with lowercase gb', () => {
      const description = "Acer Aspire 3, Intel Celeron N4020, 4gb ram, 128GB SSD, Windows 11 Home";
      expect(extractMemory(description)).toBe(4);
    });
  });

  describe('Description Memory Extraction - Special Cases', () => {
    it('should extract 16GB from format with DDR4 specification', () => {
      const description = "MSI Gaming Laptop, AMD Ryzen 7 5800H, 16GB DDR4 3200MHz, 1TB NVMe SSD, RTX 3060";
      expect(extractMemory(description)).toBe(16);
    });

    it('should extract 64GB from format with multiple memory mentions and pick the largest', () => {
      const description = "Workstation laptop with 64GB RAM (upgraded from original 16GB), 2TB SSD + 1TB HDD";
      expect(extractMemory(description)).toBe(64);
    });

    it('should extract 8GB from Finnish language description', () => {
      const description = "Kannettava tietokone, 8 Gt muistia, 256 Gt SSD, Intel i5 prosessori";
      expect(extractMemory(description)).toBe(8);
    });
  });

  describe('Title Memory Extraction', () => {
    it('should extract 16GB from title', () => {
      const title = "Lenovo ThinkPad X1 Carbon 16GB/512GB";
      expect(extractMemory(title)).toBe(16);
    });

    it('should extract 8GB from title with RAM keyword', () => {
      const title = "HP Elitebook 8GB RAM 256GB SSD";
      expect(extractMemory(title)).toBe(8);
    });
  });

  describe('Edge Cases', () => {
    it('should return null for description without memory info', () => {
      const description = "Kannettava tietokone myytävänä. Hyvä kunto. Intel i5 prosessori.";
      expect(extractMemory(description)).toBeNull();
    });

    it('should not confuse with other GB measurements', () => {
      const description = "Laptop with 512GB SSD storage, Intel i7 processor";
      expect(extractMemory(description)).toBeNull();
    });

    it('should handle multiple RAM mentions and pick the correct one', () => {
      const description = "Upgraded from 8GB to 16GB RAM, 512GB SSD";
      expect(extractMemory(description)).toBe(16);
    });

    it('should handle RAM mentioned in parentheses', () => {
      const description = "MacBook Pro (16GB RAM, 512GB SSD)";
      expect(extractMemory(description)).toBe(16);
    });
  });

  describe('Real-world Examples', () => {
    it('should extract 32GB from HP OMEN gaming laptop description', () => {
      const description = `HP OMEN 17,3" | RTX 4090 | i9-13900HX | 32 Gt RAM | 2 Tt SSD Myynnissä tehokas OMEN by HP 17-ck2065no -pelikannettava, joka on ollut videoeditointi- ja pelikäytössä. Kone toimii moitteettomasti ja soveltuu vaativaan pelaamiseen, editointiin ja muuhun raskaaseen työskentelyyn. ✅ Tekniset tiedot:🔹 Näyttö: 17,3" QHD (2560 x 1440) 240 Hz🔹 Suoritin: Intel Core i9-13900HX🔹 Näytönohjain: NVIDIA GeForce RTX 4090🔹 Muisti: 32 Gt (2 x 16 Gt) DDR5 5200 MHz🔹 Tallennustila: 2 Tt SSD (M.2 PCIe) 📦 Takuuta jäljellä elokuun loppuun. Alkuperäinen paketti löytyy.📍 Nouto Tapiolasta tai sovittaessa kuljetus pk-seudulla. Postitus neuvoteltavissa. 📝 Lisätiedot ja tekniset speksit: https://www.verkkokauppa.com/fi/product/871573/OMEN-by-HP-Laptop-17-ck2065no-7L388EA-17-pelikannettava-Win`;
      expect(extractMemory(description)).toBe(32);
    });

    it('should extract 32GB from HP OMEN gaming laptop title', () => {
      const title = `HP OMEN 17,3" | RTX 4090 | i9-13900HX | 32 Gt RAM | 2 Tt SSD`;
      expect(extractMemory(title)).toBe(32);
    });

    it('should extract 8GB from Lenovo ThinkPad description with Finnish notation', () => {
      const description = `Myydään Lenovo Thinkpad T460s kannettava tietokone. Mukaan laturi. Malli T460s i5 B1S2F
Näyttö 14
Prosessori: Intel Core i5-6300U
Muisti: 8 Gt
Kiintolevy: 256 Gt ssd
Windows 11`;
      expect(extractMemory(description)).toBe(8);
    });

    it('should extract 8GB from laptop description with RAM mentioned in specs', () => {
      const description = `Hyvä kone lähtee tästä ihan normaaliin kotikäyttöön. Läppäri toimii moitteettomasti ja muutenkin vaikuttaa pelittävän hyvin. Kosketusnäyttö löytyy myös, mutta tähän käyvä kynä meni valitettavasti rikki, mutta sormella onnistuu myös. Näyttö myös taittuu taaksepäin (ks. Kuva 3) Käytön jälkiä näytössä hieman, mutta niitä ei huomaa normaalikäytössä. Ainoa homma on, että näppäimistö on norjalainen/tanskalainen, joten Ä, Ö ja Å näppäimiä ei ole, mutta niitä silti voidaan käyttää niinä
Speksit:
Prossu Intel Core i5 6200U
Näytönohjain Intel HD graphics 520
240gb ssd
RAM 8gb
Windows 11 asennettuna ja aktivoituna
Postitus tai nouto. Myös onnistuu Kuljetus pirkanmaan alueella.
Maksu käteisellä, mobilepaylla tai tilisiirrolla`;
      expect(extractMemory(description)).toBe(8);
    });
  });
}); 
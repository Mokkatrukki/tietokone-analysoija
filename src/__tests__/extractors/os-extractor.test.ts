import { extractOs } from '../../utils/osExtractor';

describe('Operating System Information Extraction', () => {
  describe('Windows 11 Detection', () => {
    it('should extract Windows 11 from standard format', () => {
      const description = "Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 16GB RAM, 512GB SSD. Windows 11.";
      expect(extractOs(description)).toBe('Windows 11');
    });

    it('should extract Windows 11 Pro from standard format', () => {
      const description = "HP EliteBook 840 G5, Intel Core i5-8350U, 8 GB RAM, 256GB SSD, Windows 11 Pro";
      expect(extractOs(description)).toBe('Windows 11 Pro');
    });

    it('should extract Windows 11 from abbreviated format', () => {
      const description = "Dell XPS 15, Intel Core i7-10750H, 32GB, 1TB SSD, NVIDIA GTX 1650 Ti, Win11";
      expect(extractOs(description)).toBe('Windows 11');
    });

    it('should extract Windows 11 Pro from abbreviated format', () => {
      const description = "Lenovo ThinkPad P15 Gen 1, i7, 64GB DDR4, Quadro T1000 4Gb, Win11 Pro";
      expect(extractOs(description)).toBe('Windows 11 Pro');
    });

    it('should extract Windows 11 from Finnish format', () => {
      const description = "Kannettava tietokone, 8 Gt muistia, 256 Gt SSD, Intel i5 prosessori, Käyttöjärjestelmä: Windows 11";
      expect(extractOs(description)).toBe('Windows 11');
    });
  });

  describe('Windows 10 Detection', () => {
    it('should extract Windows 10 from standard format', () => {
      const description = "Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 16GB RAM, 512GB SSD. Windows 10.";
      expect(extractOs(description)).toBe('Windows 10');
    });

    it('should extract Windows 10 Pro from standard format', () => {
      const description = "HP EliteBook 840 G5, Intel Core i5-8350U, 8 GB RAM, 256GB SSD, Windows 10 Pro";
      expect(extractOs(description)).toBe('Windows 10 Pro');
    });

    it('should extract Windows 10 from abbreviated format', () => {
      const description = "Dell XPS 15, Intel Core i7-10750H, 32GB, 1TB SSD, NVIDIA GTX 1650 Ti, Win10";
      expect(extractOs(description)).toBe('Windows 10');
    });

    it('should extract Windows 10 Pro from abbreviated format', () => {
      const description = "Lenovo ThinkPad P15 Gen 1, i7, 64GB DDR4, Quadro T1000 4Gb, Win10 Pro";
      expect(extractOs(description)).toBe('Windows 10 Pro');
    });

    it('should extract Windows 10 from Finnish format', () => {
      const description = "Kannettava tietokone, 8 Gt muistia, 256 Gt SSD, Intel i5 prosessori, Käyttöjärjestelmä: Windows 10";
      expect(extractOs(description)).toBe('Windows 10');
    });
  });

  describe('Linux Detection', () => {
    it('should extract Linux from standard format', () => {
      const description = "Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 16GB RAM, 512GB SSD. Linux.";
      expect(extractOs(description)).toBe('Linux');
    });

    it('should extract Linux (Ubuntu) from standard format', () => {
      const description = "HP EliteBook 840 G5, Intel Core i5-8350U, 8 GB RAM, 256GB SSD, Linux Ubuntu";
      expect(extractOs(description)).toBe('Linux (Ubuntu)');
    });

    it('should extract Linux (Mint) from standard format', () => {
      const description = "Dell XPS 15, Intel Core i7-10750H, 32GB, 1TB SSD, NVIDIA GTX 1650 Ti, Linux Mint";
      expect(extractOs(description)).toBe('Linux (Mint)');
    });

    it('should extract Linux from Finnish format', () => {
      const description = "Kannettava tietokone, 8 Gt muistia, 256 Gt SSD, Intel i5 prosessori, Käyttöjärjestelmä: Linux";
      expect(extractOs(description)).toBe('Linux');
    });
  });

  describe('Chrome OS Detection', () => {
    it('should extract Chrome OS from standard format', () => {
      const description = "Lenovo Chromebook, Intel Celeron, 4GB RAM, 64GB eMMC, Chrome OS";
      expect(extractOs(description)).toBe('Chrome OS');
    });

    it('should extract Chrome OS from Chromebook mention', () => {
      const description = "HP Chromebook 14, Intel Celeron, 4GB RAM, 32GB eMMC";
      expect(extractOs(description)).toBe('Chrome OS');
    });
  });

  describe('macOS Detection', () => {
    it('should extract macOS from standard format', () => {
      const description = "Apple MacBook Pro, M1 Pro, 16GB RAM, 512GB SSD, macOS";
      expect(extractOs(description)).toBe('macOS');
    });

    it('should extract macOS from OS X mention', () => {
      const description = "Apple MacBook Air, Intel Core i5, 8GB RAM, 256GB SSD, OS X";
      expect(extractOs(description)).toBe('macOS');
    });
  });

  describe('Real-world Examples', () => {
    it('should extract Windows 11 Pro from detailed description', () => {
      const description = `KuvausLenovo ThinkPad X13 Gen2 – Monipuolinen kannettava työhön ja vapaalle
Ominaisuudet:
Prosessori: Intel Core i5-1145G7, 2,6 GHz (Turbo jopa 4,4 GHz)
Näyttö: 13,3″ WUXGA (1920 x 1200) kosketusnäyttö (uusi näyttöpaneeli)
Muisti: 8 GB RAM
Tallennustila: 1,0 TB SSD
Näytönohjain: Intel Iris Xe
Käyttöjärjestelmä: Windows 11 Pro
Lenovo ThinkPad X13 Gen2 on suunniteltu tehokkaan ja kevyen kannettavan joka vastaa niin työ- kuin viihdetarpeisiin. Intel Core i5-1145G7 -prosessori ja 8 GB RAM -muisti tarjoavat riittävän suorituskyvyn moniajoon ja raskaiden sovellusten käyttöön. 13,3 tuuman WUXGA-kosketusnäyttö tarjoaa terävän ja selkeän kuvanlaadun, joka on ideaalinen niin asiakirjojen käsittelyyn kuin multimediaan.`;
      expect(extractOs(description)).toBe('Windows 11 Pro');
    });

    it('should extract Windows 11 from Lenovo ThinkPad description', () => {
      const description = `Myydään Lenovo Thinkpad T460s kannettava tietokone. Mukaan laturi. 
Malli T460s i5 B1S2F
Näyttö 14
Prosessori: Intel Core i5-6300Uz
Muisti: 8 Gt
Kiintolevy: 256 Gt ssd
Windows 11`;
      expect(extractOs(description)).toBe('Windows 11');
    });

    it('should extract Windows 11 from title with abbreviated format', () => {
      const title = "Lenovo ThinkPad P15 Gen 1, i7, 64GB DDR4, Quadro T1000 4Gb, Win11";
      expect(extractOs(title)).toBe('Windows 11');
    });
  });

  describe('Edge Cases', () => {
    it('should return null for description without OS info', () => {
      const description = "Kannettava tietokone myytävänä. Hyvä kunto. Intel i5 prosessori.";
      expect(extractOs(description)).toBeNull();
    });

    it('should handle case insensitivity', () => {
      const description = "Laptop with windows 11 PRO operating system";
      expect(extractOs(description)).toBe('Windows 11 Pro');
    });

    it('should handle spaces in OS names', () => {
      const description = "Laptop with Windows   11 operating system";
      expect(extractOs(description)).toBe('Windows 11');
    });
  });
}); 
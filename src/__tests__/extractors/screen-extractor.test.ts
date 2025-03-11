import { extractScreenType } from '../../utils/screenExtractor';

describe('Screen Type Information Extraction', () => {
  describe('Description Screen Type Extraction - IPS', () => {
    it('should extract IPS from ThinkPad listing', () => {
      const description = "Siistikuntoinen ja täysin toimiva.Pieniä käytönjälkiä löytyy mutta toimii kuin pitääkin. 12.5\" LENOVO THINPAD X280 Intel i5 Full HD 1920×1080 IPSUltrabook Business Laptop 256GB SSD| 8GB RAM| HDMI | 4G SIM WINDOWS 11 Pro Intel Core i5@8250U 1920×1080UHD Graphics 620 UHD IPS- 8GB RAM- 256GB SSD  - 1 × HDMI, 3 x USB 4G SIM CARDMore than 8hours battery life🔋 + Microsoft office + Adobe Reader";
      expect(extractScreenType(description)).toBe('IPS');
    });

    it('should extract IPS from Legion gaming laptop listing', () => {
      const description = "Erittäin tehokas ja moderni Legion 5 ei jätä toivomisen varaa ja sopii taatusti vaativimmallekkin pelaajalle ja tehokäyttäjälle!\n\nTällä Lenovon modernilla parempaan Legion-pelikoneluokkaan kuuluvalla kannettavalla pelaat uudetkin pelit sulavasti koneen omalla tarkalla ja responsiivisella näytöllä\n\nKiitos hillityn muotoilun, tehokkaan jäähdytyksensä ja teho-ominaisuuksiensa vuoksi soveltuu Legion 5 loistavasti myös vaativaan opiskelu-, ja työkäyttöön.\n\nReilusti tehoa koneeseen tuovat erittäin vääntävä 8-Ydin Ryzen 7 5800H prosessori, uusimmatkin pelit pyörittävä RTX3060 näytönohjain, sekä 16GB keskusmuistia.\nTallennustila koneesta ei myöskään heti lopu kesken, kiitos nopeakäyttöisen ja tilavan 1000GB m.2 SSD-levyn.\n\nTehokkaan paketin kruunaa tarkka 1440p-näyttö G-Sync tuella ja sulavalla 165Hz virkistystaajuudella.\n\nKunto: A, vain kevyttä kulumaa koneen kannessa, muuten täysin uudenveroinen.\nAkkukesto: ~4-6h+ peruskäytössä (peli/tehokäyttöä suositellaan vain piuhan päässä)\nMalli: Lenovo Legion 5 15ACH6H\nKäyttöjärjestelmä: Windows 11\nNäyttö: 15,6 tuumaa, 165Hz 2560x1440p heijastussuojattu IPS-paneeli, G-Sync, 100% sRGB, 300 nits\nNäytönohjain: RTX 3060 6GB\nProsessori: AMD Ryzen 7 5800H 8C/16T @ 2.80-4.20GHz\nKeskusmuisti: 16GB 3200MHz DDR4\nSSD-levy: 1000GB PCIe NVMe m.2 (Vapaana yksi m2 paikka)\nNäyttöliitännät: HDMI, USB-C(DP)\nLiitännät: 4x USB3, 2x USB-C, 1x audio\nVerkkoyhteys: Wifi, LAN\nWebcam\nBluetooth\nColdfront 3.0 - kaksoisjäähdytys";
      expect(extractScreenType(description)).toBe('IPS');
    });

    it('should extract IPS from Dell laptop listing', () => {
      const description = "Dell Latitude 7420, 14\" FHD IPS-näyttö (1920x1080), Intel Core i5-1145G7, 16GB RAM, 512GB SSD, Windows 11 Pro, erittäin siisti kunto, akku kestää hyvin";
      expect(extractScreenType(description)).toBe('IPS');
    });
  });

  describe('Description Screen Type Extraction - TN', () => {
    it('should extract TN from budget gaming laptop listing', () => {
      const description = "Myydään Acer Nitro 5 pelikannettava. 15.6\" TN-näyttö, 144Hz, AMD Ryzen 5 5600H, GTX 1650, 16GB RAM, 512GB SSD. Ostettu 2022, vähän käytetty.";
      expect(extractScreenType(description)).toBe('TN');
    });

    it('should extract TN from older ThinkPad listing', () => {
      const description = "Lenovo ThinkPad T440p, 14\" HD TN-paneeli (1366x768), Intel Core i5-4300M, 8GB RAM, 256GB SSD, Windows 10 Pro. Akku vaihdettu 2023, kestää noin 4 tuntia.";
      expect(extractScreenType(description)).toBe('TN');
    });

    it('should extract TN from budget laptop listing', () => {
      const description = "HP 250 G7 kannettava tietokone. 15.6\" HD TN matta näyttö, Intel Celeron N4020, 8GB RAM, 256GB SSD, Windows 11 Home. Hyvä perusläppäri opiskelijalle.";
      expect(extractScreenType(description)).toBe('TN');
    });
  });

  describe('Description Screen Type Extraction - OLED', () => {
    it('should extract OLED from premium laptop listing', () => {
      const description = "Samsung Galaxy Book Pro 360, 13.3\" FHD AMOLED kosketusnäyttö, Intel Core i7-1165G7, 16GB RAM, 512GB SSD, S Pen kynä mukana, Windows 11";
      expect(extractScreenType(description)).toBe('OLED');
    });

    it('should extract OLED from Dell XPS listing', () => {
      const description = "Dell XPS 13 9310 OLED, 13.4\" 3.5K (3456x2160) OLED kosketusnäyttö, Intel Core i7-1185G7, 16GB RAM, 1TB SSD, Windows 11 Pro. Huippuluokan ultrabook.";
      expect(extractScreenType(description)).toBe('OLED');
    });

    it('should extract OLED from Asus Zenbook listing', () => {
      const description = "Asus Zenbook 14X OLED, 14\" 2.8K OLED HDR näyttö (2880x1800), Intel Core i7-12700H, 16GB RAM, 1TB SSD, Windows 11. Erittäin ohut ja kevyt premium-kannettava.";
      expect(extractScreenType(description)).toBe('OLED');
    });
  });

  describe('Common Screen Type Variations', () => {
    const testCases = [
      // IPS variations
      { input: 'IPS-näyttö', expected: 'IPS' },
      { input: 'IPS paneeli', expected: 'IPS' },
      { input: 'Full HD IPS', expected: 'IPS' },
      { input: 'FHD IPS', expected: 'IPS' },
      { input: 'IPS LCD', expected: 'IPS' },
      { input: 'IPS-paneeli', expected: 'IPS' },
      
      // TN variations
      { input: 'TN-näyttö', expected: 'TN' },
      { input: 'TN paneeli', expected: 'TN' },
      { input: 'HD TN', expected: 'TN' },
      { input: 'TN-paneeli', expected: 'TN' },
      { input: 'TN LCD', expected: 'TN' },
      
      // OLED variations
      { input: 'OLED-näyttö', expected: 'OLED' },
      { input: 'AMOLED', expected: 'OLED' },
      { input: 'Super AMOLED', expected: 'OLED' },
      { input: 'OLED paneeli', expected: 'OLED' },
      { input: 'OLED-paneeli', expected: 'OLED' }
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should extract "${expected}" from "${input}"`, () => {
        expect(extractScreenType(input)).toBe(expected);
      });
    });
  });

  describe('Mixed and Edge Cases', () => {
    it('should prioritize OLED over IPS when both are mentioned', () => {
      const description = "Laptop with both IPS and OLED technologies mentioned, but it's actually an OLED display";
      expect(extractScreenType(description)).toBe('OLED');
    });

    it('should return null for description without screen type info', () => {
      const description = "Kannettava tietokone myytävänä. Hyvä kunto. Intel i5 prosessori.";
      expect(extractScreenType(description)).toBeNull();
    });

    it('should handle case insensitivity', () => {
      const description = "Laptop with ips display";
      expect(extractScreenType(description)).toBe('IPS');
    });

    it('should extract IPS when it appears multiple times in the description', () => {
      const description = "Siistikuntoinen ja täysin toimiva.Pieniä käytönjälkiä löytyy mutta toimii kuin pitääkin. 12.5\" LENOVO THINPAD X280 Intel i5 Full HD 1920×1080 IPSUltrabook Business Laptop 256GB SSD| 8GB RAM| HDMI | 4G SIM WINDOWS 11 Pro Intel Core i5@8250U 1920×1080UHD Graphics 620 UHD IPS- 8GB RAM- 256GB SSD  - 1 × HDMI, 3 x USB 4G SIM CARDMore than 8hours battery life🔋 + Microsoft office + Adobe Reader";
      expect(extractScreenType(description)).toBe('IPS');
    });
  });
}); 
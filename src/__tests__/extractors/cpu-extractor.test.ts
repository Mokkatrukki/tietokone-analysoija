import { LaptopListing } from '../../types/LaptopListing';
import { extractProcessor } from '../../utils/processorExtractor';

describe('LaptopListing', () => {
  it('should correctly add 1 + 1', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('CPU Information Extraction', () => {
  describe('Title CPU Extraction', () => {
    it('should extract i7-8550U from ThinkPad title', () => {
      const title = "Lenovo ThinkPad T480s 14\" i7-8550U 256GB SSD";
      expect(extractProcessor(title)).toBe('i7-8550U');
    });

    it('should return null for incomplete CPU model in title', () => {
      const title = "Dell E6520 - 15\" i5 8GB 250GB Läppäri";
      expect(extractProcessor(title)).toBeNull();
    });

    it('should return null for partial CPU model in title', () => {
      const title = "Acer Chromebook Plus 515 i3-12";
      expect(extractProcessor(title)).toBeNull();
    });

    it('should extract Core i5-8250U from Intel Core i5@8250U format', () => {
      const description = "Siistikuntoinen ja täysin toimiva.Pieniä käytönjälkiä löytyy mutta toimii kuin pitääkin. 12.5\" LENOVO THINPAD X280 Intel i5 Full HD 1920×1080 IPSUltrabook Business Laptop 256GB SSD| 8GB RAM| HDMI | 4G SIM WINDOWS 11 Pro Intel Core i5@8250U 1920×1080UHD Graphics 620 UHD IPS- 8GB RAM- 256GB SSD  - 1 × HDMI, 3 x USB 4G SIM CARDMore than 8hours battery life🔋 + Microsoft office + Adobe Reader";
      expect(extractProcessor(description)).toBe('Core i5-8250U');
    });
  });

  describe('Description CPU Extraction - Intel', () => {
    it('should extract i7-8550U from ThinkPad T480s listing', () => {
      const description = "Alle vuosi sitten verkkokaupasta ostettu läppäri, kesäkuu/2024, 3-vuoden takuu.Ei näkyvää kulumaa, suorituskyky moitteemassa kunnossa. Akkukesto n. 4h ilman laturia.Käytetty vähän/satunnaisesti netin selailuun oston jälkeen. ''Lenovo ThinkPad T480s on ohut, kevyt ja työhön suunniteltu kannettava tietokone ammattilaisille. Vain reilun 18 mm paksuinen ja 1,3 kiloinen runko on valmistettu magnesiumista sekä hiilikuituvahvistetusta muovista, mikä tekee siitä jämäkän, kestävän ja kevyen.'' Lenovo ThinkPad T480s  14\" i7-8550U  Win 11 Pro   Muistin koko: 8.0 GB  RAM Näppäimistö: Pohjoismainen    Tallennustila: 256 GB SSD Wi-Fi 5 (802.11ac) Bluetooth 5.0";
      expect(extractProcessor(description)).toBe('i7-8550U');
    });

    it('should extract i7-10510U from business laptop listing', () => {
      const description = "Yrityskäytöstä poistettu kannettava tietokone. Kunto hyvä. Mukaan langaton hiiri ja laturi.Prosessori: i7-10510UMuisti: 16Gt RAMLevytila: 512 GtValmistusleima: 4/2021";
      expect(extractProcessor(description)).toBe('i7-10510U');
    });

    it('should extract i5-5300U from ThinkPad X250 listing', () => {
      const description = "Siisti Lenovo Thinkpad X250. Akut kunnossa, mukana myös telakka sekä alkuperäinen Lenovo laturi. Nyt valmiiksi tingittyyn hintaan 100€. Intel Core i5-5300U8 GB DDR4 keskusmuisti256 GB SSD kiintolevy12,5\" HD näyttöTaustavalaistut näppäimetWLAN, BluetoothWindows 10 Pro";
      expect(extractProcessor(description)).toBe('i5-5300U');
    });

    it('should extract i5-8265U from ThinkPad T490s listing', () => {
      const description = "KuvausTuotenimi: Lenovo ThinkPad T490s\nNäyttö: 14\" Full HD IPS\nProsessori: Intel Core i5-8265U 1.60 GHz, Turbo 3.90 GHz\nKeskusmuisti: 16GB DDR4\nTallennustila: 256GB M.2 SSD\nAkku: Hyvä\nKunto: Erinomainen\nMukaan: Laturi\nTakuu 24kk";
      expect(extractProcessor(description)).toBe('i5-8265U');
    });

    it('should convert space-separated format to hyphenated format for Dell laptop', () => {
      const description = "Hyvä Dell Latitude E6520 läppäri. Toimii hyvin - ainoa ongelma on akku (vanha / ei toimi), mutta tietokone toimii edelleen hyvin. 120e - Noutaa Pälkäneeltä tai 8e postitus - käteinen, pankkisiirto, MobilePay tai Paypal. You can also message me in English if that is easier :) Sisältää:- Dell E-6520 kannettava / laptop-- Intel Core i5 2540M 2.60GHz 32nm CPU-- 8GB DDR3 RAM";
      expect(extractProcessor(description)).toBe('i5-2540M');
    });
    

    it('should return null for description without processor info', () => {
      const description = "Kannettava tietokone myytävänä. Hyvä kunto.";
      expect(extractProcessor(description)).toBeNull();
    });

    it('should extract first processor (i5-3320M) when multiple processors are mentioned', () => {
      const description = "Hyväkuntoinen t430 thinkapdi.  -Speksit: 1-128gb sata ssd ja 500gb hdd-i5 3320M-16gb ramia. -Asennettuna windows 10, jonka rinnalla parrot os. (voin asentaa tarvittaessa win 11 tms.) -Prosessorin voi päivittää tehokkaammaksi, i7 3720qm tms.  -Myös coreboot onnistuu.  -Erittäin pätevä laitos vaikkapa internetin selailuun, laadukas näppis ja kirjotustuntuma. -Akku vaihdettu, tilalle laitettu laadukas greencellin akku.  Postitus onnistuu, mutta etusijalla nouto.";
      expect(extractProcessor(description)).toBe('i5-3320M');
    });
  });

  describe('Description CPU Extraction - AMD', () => {
    it('should extract Ryzen 5 3600 from desktop listing', () => {
      const description = "Myydään tehokas pelitietokone AMD Ryzen 5 3600 prosessorilla. 16GB RAM, RTX 3060.";
      expect(extractProcessor(description)).toBe('Ryzen 5 3600');
    });

    it('should extract Ryzen 3 Pro 4450U from ThinkPad X13 listing', () => {
      const description = "KuvausYrityskäytöstä poistettu siisti läppäri.\nTekniset Tiedot\nTietokoneen malli : Lenovo ThinkPad X13\nSuoritin : AMD Ryzen 3 Pro 4450U (2.50 GHz) 4-ydin\nMuisti (RAM) : 8 GB DDR4 soldered – ei lisättävissä\nKiintolevy : 256 GB M.2 SSD\nNäytön koko : 13.3″ FHD-IPS\nResoluutio : 1920 x 1080p\nNäytönohjain : AMD Radeon Graphics\nTaustavalaistu näppäimistö : Kyllä\nKäyttöjärjestelmä : Windows 11 Pro\nUSB-portit : 2x USB-C, 2x USB 3.1 Gen 1, USB-C-docking\nWeb Kamera : Kyllä\nHDMI : Kyllä\nKuntoluokka : Käytetty A2\nSC-Kortin lukija : Kyllä\nAkun kesto (arvioitu) : 6 t\nAsennetut ohjelmat : LibreOffice, Google Chrome, Mozilla Firefox, Skype, Zoom, VLC Media Player, Foxit PDF Reader\nTakuu : 12 kuukautta";
      expect(extractProcessor(description)).toBe('Ryzen 3 Pro 4450U');
    });

    it('should extract Ryzen 7 5800X from gaming PC listing', () => {
      const description = "Huipputehokas pelikone: AMD Ryzen 7 5800X, 32GB DDR4, RTX 3080, 2TB NVMe";
      expect(extractProcessor(description)).toBe('Ryzen 7 5800X');
    });

    it('should extract EPYC 7763 from server listing', () => {
      const description = "Enterprise palvelin: AMD EPYC 7763 64-core prosessori, 512GB ECC RAM";
      expect(extractProcessor(description)).toBe('EPYC 7763');
    });

    it('should return null for description without processor info', () => {
      const description = "Kannettava tietokone myytävänä. Hyvä kunto.";
      expect(extractProcessor(description)).toBeNull();
    });
  });
});
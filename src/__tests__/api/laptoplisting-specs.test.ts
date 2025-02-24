import { LaptopListing } from '../../types/LaptopListing';
import { extractIntelProcessor } from '../../utils/processorExtractor';

describe('LaptopListing', () => {
  it('should correctly add 1 + 1', () => {
    expect(1 + 1).toBe(2);
  });
});


describe('Intel Processor Extraction', () => {
  it('should extract i7-8550U from ThinkPad T480s listing', () => {
    const description = "Alle vuosi sitten verkkokaupasta ostettu läppäri, kesäkuu/2024, 3-vuoden takuu.Ei näkyvää kulumaa, suorituskyky moitteemassa kunnossa. Akkukesto n. 4h ilman laturia.Käytetty vähän/satunnaisesti netin selailuun oston jälkeen. ''Lenovo ThinkPad T480s on ohut, kevyt ja työhön suunniteltu kannettava tietokone ammattilaisille. Vain reilun 18 mm paksuinen ja 1,3 kiloinen runko on valmistettu magnesiumista sekä hiilikuituvahvistetusta muovista, mikä tekee siitä jämäkän, kestävän ja kevyen.'' Lenovo ThinkPad T480s  14\" i7-8550U  Win 11 Pro   Muistin koko: 8.0 GB  RAM Näppäimistö: Pohjoismainen    Tallennustila: 256 GB SSD Wi-Fi 5 (802.11ac) Bluetooth 5.0";
    expect(extractIntelProcessor(description)).toBe('i7-8550U');
  });

  it('should extract i7-10510U from business laptop listing', () => {
    const description = "Yrityskäytöstä poistettu kannettava tietokone. Kunto hyvä. Mukaan langaton hiiri ja laturi.Prosessori: i7-10510UMuisti: 16Gt RAMLevytila: 512 GtValmistusleima: 4/2021";
    expect(extractIntelProcessor(description)).toBe('i7-10510U');
  });


  it('should extract i5-5300U from ThinkPad X250 listing', () => {
    const description = "Siisti Lenovo Thinkpad X250. Akut kunnossa, mukana myös telakka sekä alkuperäinen Lenovo laturi. Nyt valmiiksi tingittyyn hintaan 100€. Intel Core i5-5300U8 GB DDR4 keskusmuisti256 GB SSD kiintolevy12,5\" HD näyttöTaustavalaistut näppäimetWLAN, BluetoothWindows 10 Pro";
    expect(extractIntelProcessor(description)).toBe('i5-5300U');
  });

  it('should extract i5-8265U from ThinkPad T490s listing', () => {
    const description = "KuvausTuotenimi: Lenovo ThinkPad T490s\nNäyttö: 14\" Full HD IPS\nProsessori: Intel Core i5-8265U 1.60 GHz, Turbo 3.90 GHz\nKeskusmuisti: 16GB DDR4\nTallennustila: 256GB M.2 SSD\nAkku: Hyvä\nKunto: Erinomainen\nMukaan: Laturi\nTakuu 24kk";
    expect(extractIntelProcessor(description)).toBe('i5-8265U');
  });

  it('should convert space-separated format to hyphenated format for Dell laptop', () => {
    const description = "Hyvä Dell Latitude E6520 läppäri. Toimii hyvin - ainoa ongelma on akku (vanha / ei toimi), mutta tietokone toimii edelleen hyvin. 120e - Noutaa Pälkäneeltä tai 8e postitus - käteinen, pankkisiirto, MobilePay tai Paypal. You can also message me in English if that is easier :) Sisältää:- Dell E-6520 kannettava / laptop-- Intel Core i5 2540M 2.60GHz 32nm CPU-- 8GB DDR3 RAM";
    expect(extractIntelProcessor(description)).toBe('i5-2540M');
  });

  it('should return null for description without processor info', () => {
    const description = "Kannettava tietokone myytävänä. Hyvä kunto.";
    expect(extractIntelProcessor(description)).toBeNull();
  });
});


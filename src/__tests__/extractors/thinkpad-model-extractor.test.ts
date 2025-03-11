import { extractThinkpadModel } from '../../utils/thinkpadModelExtractor';

describe('ThinkPad Model Extractor', () => {
  describe('extractThinkpadModel', () => {
    it('should return null for non-ThinkPad descriptions', () => {
      expect(extractThinkpadModel('Dell XPS 13 laptop for sale')).toBeNull();
      expect(extractThinkpadModel('HP Pavilion gaming laptop')).toBeNull();
      expect(extractThinkpadModel('MacBook Pro 16 inch')).toBeNull();
    });

    describe('T-series models', () => {
      it('should extract T480 model', () => {
        expect(extractThinkpadModel('Lenovo ThinkPad T480 laptop for sale')).toBe('T480');
      });

      it('should extract T490s model', () => {
        expect(extractThinkpadModel('ThinkPad T490s with 16GB RAM')).toBe('T490S');
      });

      it('should extract T14 model', () => {
        expect(extractThinkpadModel('Selling my ThinkPad T14 laptop')).toBe('T14');
      });

      it('should extract T14 with generation', () => {
        expect(extractThinkpadModel('ThinkPad T14 Gen 2 (Intel) laptop')).toBe('T14 GEN 2');
      });
    });

    describe('X-series models', () => {
      it('should extract X280 model', () => {
        expect(extractThinkpadModel('Lenovo ThinkPad X280 ultrabook')).toBe('X280');
      });

      it('should extract X1 Carbon model', () => {
        expect(extractThinkpadModel('ThinkPad X1 Carbon laptop')).toBe('X1C');
      });

      it('should extract X1 Carbon with generation', () => {
        expect(extractThinkpadModel('ThinkPad X1 Carbon Gen 6 ultrabook')).toBe('X1C GEN 6');
      });

      it('should extract X1 Carbon from X1C abbreviation', () => {
        expect(extractThinkpadModel('ThinkPad X1C Gen 7 laptop')).toBe('X1C GEN 7');
      });

      it('should extract X1 Yoga model', () => {
        expect(extractThinkpadModel('ThinkPad X1 Yoga convertible laptop')).toBe('X1 YOGA');
      });

      it('should extract X1 Yoga with generation', () => {
        expect(extractThinkpadModel('ThinkPad X1 Yoga Gen 4 2-in-1')).toBe('X1 YOGA GEN 4');
      });
    });

    describe('P-series models', () => {
      it('should extract P52 model', () => {
        expect(extractThinkpadModel('Lenovo ThinkPad P52 workstation')).toBe('P52');
      });

      it('should extract P1 model', () => {
        expect(extractThinkpadModel('ThinkPad P1 mobile workstation')).toBe('P1');
      });

      it('should extract P1 with generation', () => {
        expect(extractThinkpadModel('ThinkPad P1 Gen 3 laptop')).toBe('P1 GEN 3');
      });
    });

    describe('L-series models', () => {
      it('should extract L380 model', () => {
        expect(extractThinkpadModel('Lenovo ThinkPad L380 business laptop')).toBe('L380');
      });

      it('should extract L13 model', () => {
        expect(extractThinkpadModel('ThinkPad L13 laptop for sale')).toBe('L13');
      });

      it('should extract L13 Yoga model', () => {
        expect(extractThinkpadModel('ThinkPad L13 Yoga 2-in-1 laptop')).toBe('L13');
      });
    });

    describe('E-series models', () => {
      it('should extract E480 model', () => {
        expect(extractThinkpadModel('Lenovo ThinkPad E480 budget laptop')).toBe('E480');
      });

      it('should extract E14 model', () => {
        expect(extractThinkpadModel('ThinkPad E14 laptop for students')).toBe('E14');
      });

      it('should extract E14 with generation and processor', () => {
        expect(extractThinkpadModel('ThinkPad E14 Gen 2 (AMD) laptop')).toBe('E14 GEN 2');
      });
    });

    describe('Other series and special cases', () => {
      it('should extract W540 model', () => {
        expect(extractThinkpadModel('Lenovo ThinkPad W540 workstation')).toBe('W540');
      });

      it('should extract Yoga 370 model', () => {
        expect(extractThinkpadModel('ThinkPad Yoga 370 convertible')).toBe('YOGA 370');
      });

      it('should extract Helix model', () => {
        expect(extractThinkpadModel('ThinkPad Helix 2-in-1 tablet')).toBe('HELIX');
      });

      it('should extract X1 Extreme model', () => {
        expect(extractThinkpadModel('ThinkPad X1 Extreme gaming laptop')).toBe('X1 EXTREME');
      });

      it('should extract X1 Extreme with generation', () => {
        expect(extractThinkpadModel('ThinkPad X1 Extreme Gen 2 with GTX 1650')).toBe('X1 EXTREME GEN 2');
      });
    });

    describe('Real-world examples', () => {
      it('should extract X280 from a complex description', () => {
        const description = 'Siistikuntoinen ja täysin toimiva.Pieniä käytönjälkiä löytyy mutta toimii kuin pitääkin. 12.5" LENOVO THINPAD X280 Intel i5 Full HD 1920×1080 IPSUltrabook Business Laptop 256GB SSD| 8GB RAM| HDMI | 4G SIM WINDOWS 11 Pro Intel Core i5@8250U 1920×1080UHD Graphics 620 UHD IPS- 8GB RAM- 256GB SSD  - 1 × HDMI, 3 x USB 4G SIM CARDMore than 8hours battery life🔋 + Microsoft office + Adobe Reader';
        expect(extractThinkpadModel(description)).toBe('X280');
      });

      it('should extract T460s from a Finnish description', () => {
        const description = 'Myydään Lenovo Thinkpad T460s kannettava tietokone. Mukaan laturi. Malli T460s i5 B1S2F\nNäyttö 14\nProsessori: Intel Core i5-6300U\nMuisti: 8 Gt\nKiintolevy: 256 Gt ssd\nWindows 11';
        expect(extractThinkpadModel(description)).toBe('T460S');
      });
      
      it('should extract T14s Gen 2 from a detailed Finnish description', () => {
        const description = 'KuvausT14s G2 kuuluu Lenovon laadukkaaseen ThinkPad yritysmallistoon. S-mallit ovat perinteisiä Thinkpadeja ohuempia ja kevyempiä tinkimättä kuitenkaan kestävyydestä tai nopeakäyttöisyydestä.\nKoneen kattavaan varusteluun kuuluvat mm tasokas Full HD IPS-näyttö, modernit liitännät, erittäin vankka mutta kevyt rakenne, sekä taustavalaistu näppäimistö.\nT14s yhdistää tinkimättömän suorituskyvyn ja kestävyyden laadukkaaseen ja kompaktiin pakettiin, joka sopii niin tien päälle työtehtäviin, kuin vaativampiin opintoihinkin.\nTämä kyseinen kone on mallinsa paremmin varusteltu yksilö sisältäen mm tehokkaamman 11. sukupolven i5 vPro-prosessorin, 16GB DDR4 keskusmuistia, nopeakäyttöisen 512GB m.2 NVMe SSD-levyn, sekä sisäänrakennetun 4G-modeemin.\nPitkällä takuulla varustettua huippuluokan yrityskannettavaa hieman vaativammallekin käyttäjälle!\nKunto: A, normaalia kulumaa koneen kannessa, yleisilme siisti, näyttö virheetön.\nMalli: Lenovo ThinkPad T14s G2\nAkku: ~6-8h+ käytöstä riippuen\nKäyttöjärjestelmä: Windows 11 Pro\nNäyttö: 14 tuumaa Full HD 1920x1080p IPS-paneeli, heijastamaton\nProsessori: Intel Core i5-1145G7 vPro 4C/8T @ 2.50-4.30GHz\nKeskusmuisti: 16GB DDR4\nSSD-Levy: 512GB m.2 PCIe NVMe\nNäyttöliitännät: 2xUSB-C/Thunderbolt 4, HDMI\nLiitännät: 2xUSB3, 2xUSB-C, Kuuloke/Mic\nVerkkoyhteys: Wifi, Bluetooth, 4G/LTE\nRoiskesuojattu ja taustavalaistu näppäimistö\nTakuu: 18 kuukautta\nHinta sisältää arvonlisäveron 25,5%.\nTietokoneeseen on asennettu Windows 11 Pro päivityksineen sekä perusohjelmat käyttöä varten kuten nettiselaimet, ilmainen toimisto-ohjelmistopaketti sekä ohjelmat mediatoistoa varten. Tietokone on täysin huollettu sekä testattu ja on heti käyttövalmis.\nMeille voit myös jättää vanhat tietokoneet ja niiden oheislaitteet kierrätettäväksi.';
        expect(extractThinkpadModel(description)).toBe('T14S GEN 2');
      });
      
      it('should extract T14s Gen 2 from a title', () => {
        const title = 'Lenovo T14s G2 [i5-1145G7/16GB/512GB/LTE] 18kk Takuu';
        expect(extractThinkpadModel(title)).toBe('T14S GEN 2');
      });
      
      it('should extract L14 Gen 2 from a detailed Finnish description', () => {
        const description = 'KuvausLinkki verkkokauppaamme tähän koneeseen:\nhttps://itkeskus.fi/tuote/lenovo-thinkpad-l14-gen2-i5-1135g7-8gb-256gb-kannettava-tietokone/?utm_source=tori&utm_medium=linkki&utm_campaign=ilmotukset\nHyvin huollettuna käytetty tietokone on erinomainen valinta. Tietokoneet ovat pääsääntöisesti melko huoltovapaita laitteita, mutta käytettyä konetta ostaessasi kannattaa varmistaa, että tietyt huollot ovat tehty. Muuten koneen tarina voi jäädä lyhyeksi. Näistä huolloista on kerrottu lisää blogissamme, joka löytyy täältä https://itkeskus.fi/2024/10/07/miksi-ostaa-kaytetty-tietokone-meilta/?utm_source=tori&utm_medium=linkki&utm_campaign=blogi\nEmme pidä reklamaatioista. Siksi myymämme koneet käyvät läpi laajan 7-osaisen huolto-ohjelman. Haluamme, että kone kestää käytössäsi mahdollisimman pitkään. Siitä hyötyvät kaikki: sinä (suurempi käyttöarvo), me (olet tyytyväinen asiakas) ja ympäristö (vähemmän kulutettuja luonnonvaroja). Näiden syiden vuoksi myymämme koneet ovat täysin huollettuja.\nLenovo ThinkPad L14 Gen 2 on kannettava, joka tuo luotettavuutta ja joustavuutta jokaisen työpäivän tarpeisiin. Sen kestävä rakenne ja huipputason suorituskyky ovat omiaan yrityskäyttöön ja liikkuvaan työskentelyyn. Riippumatta siitä, oletko toimistolla vai tien päällä, ThinkPad L14 Gen 2 pitää huolen, että pysyt tuottavana ja yhteydessä.\nKone on täysin valmis käyttöön. Käyttäjä on valmiiksi luotu. Asennettu Google Chrome, Mozilla Firefox ja Acrobat Reader, jotta koneen käyttöönotto on helpompaa.\nPoikkeuksena verrattuna moniin muihin käytettyjen tietokoneiden myyjiin, annamme myös akulle vuoden takuun.\nAkku:\nAkun kapasiteetti uuteen verrattuna 85 %. 4-kennoinen 45 Wh Litiumioniakku. RapidCharge-tuki noin 80 % latausta tunnissa.\nTekniset tiedot:\nNäyttö: 14\'\' 1920 x 1080, FullHD, heijastamaton IPS-paneeli\nKäyttöjärjestelmä: Windows 11 Pro\nProsessori: Intel Core i5-1135G7 (4-ydin, 2.4 GHz, Turbo 4.2 GHz, 8 Mb välimuisti)\nKeskusmuisti: 8 GB DDR4 3200 MHz (2 x SO-DIMM-paikkaa, maksimikapasiteetti 64 GB)\nNäytönohjain: Intel Iris Xe Graphics\nKovalevy: Toshiba 256 GB NVMe SSD\nMikrofoni: Kyllä\nKaiuttimet: Kyllä, Dolby Audio\nWeb-kamera: Kyllä 720p HD\nLangaton verkkoyhteys: Kyllä, Wi-Fi 6 802.11ax\nBluetooth: Kyllä, Bluetooth 5.1\nMuut ominaisuudet: TPM 2.0, Windows Hello -kasvojentunnistus, sormenjälkilukija, ThinkShutter -kameransuojus, taustavalaistu näppäimistö\nLiitännät:\nNäyttö: 1 x HDMI 2.0\nUSB: 2 x USB 3.2 Gen1 Type-C (1 x PowerDelivery ja Displayport 1.4/Thunderbolt 4)\nÄäni: 3.5 mm kuulokemikrofoniliitäntä\nMuut: MicroSD-kortinlukija, RJ45 Ethernet, SmartCard -lukija\nPaino: 1,74 kg\nMitat: 33,1 x 23,5 x 2,04 cm\nTakuu:\n12 kk, koskee myös akkua\nLisätietoa meistä: https://tampereentietokoneapu.fi/meista/\nLinkki verkkokauppaamme tähän koneeseen:\nhttps://itkeskus.fi/tuote/lenovo-thinkpad-l14-gen2-i5-1135g7-8gb-256gb-kannettava-tietokone/?utm_source=tori&utm_medium=linkki&utm_campaign=ilmotukset\nHakusanat:\nyritysläppäri, yrityskone, käytetty tietokone, tietokone, laptop, tietokone, kannettava tietokone, läppäri, business laptop';
        expect(extractThinkpadModel(description)).toBe('L14 GEN 2');
      });
      
      it('should extract L14 Gen 2 from a title', () => {
        const title = 'Lenovo ThinkPad L14 Gen2 i5-1135G7/8GB/256GB kannettava tietokone, HUOLLETTU';
        expect(extractThinkpadModel(title)).toBe('L14 GEN 2');
      });


      it('should extract L14 Gen 1 from a title', () => {
        const title = 'Lenovo ThinkPad L14 Gen1 i5-1135G7/8GB/256GB kannettava tietokone, HUOLLETTU';
        expect(extractThinkpadModel(title)).toBe('L14 GEN 1');
      });
    });
  });
}); 
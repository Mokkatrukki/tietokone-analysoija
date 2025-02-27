import { extractGpu } from '../../utils/gpuExtractor';

describe('GPU Information Extraction', () => {
  describe('Description GPU Extraction - NVIDIA', () => {
    it('should extract GeForce RTX 4080 from gaming laptop listing', () => {
      const description = "Peliläppäri on ostettu heinäkuussa 2023 gigantista ja käytetty pelaamiseen. Siinä ei ole mitään naarmuja tai käytönjälkijä. Se pyörittää kaikkiapelejä erittäin hyvin jopa 4k resolutiolla.Myyn sen koska olen käyttänyt sitä erittäin vähänviimeisen vuoden aikana eikä sille ole tarvetta tällähetkellä.Olen asentanut siihen toisen ssa levyn eli siina on nyt 2tb muistia.Alkuperainen hinta 2700€ + ssd noin 100€Alkuperäinen paketti ja kaikki siinä olevat tavarat ovat tallella (laturi jne.)Tuotetiedot:Intel® CoreTM j9-139OOHX -prosessoriNVIDIA GeForce RTX 4080 -näytönohjain(12gtvram)16 GB DDR5 RAM, 2 TB SSD-muisti 2560x1600 240hz  Nouto mieluummin tai postitus maksun jälkeen!Kuitti löytyy!Voi kysyä kuvista tai lisätiedoista.";
      expect(extractGpu(description)).toBe('GeForce RTX 4080');
    });

    it('should extract GeForce GTX 1650 from Lenovo laptop listing', () => {
      const description = "Hyvässä kunnossa oleva Lenovon Ideapadi, käytetty työ tietokoneena n 2 vuotta. Jäänyt vähälle käytölle. Tietokoonella pyörii todella hyvin kaikki FPS pelit cs, apex yms. Lisäkysymyksia yv. Prossesori AMD Ryzen 5 4600H with radeon graphicsRam 16 GB15,6 tuumainenNvidia Geforce GTX 1650 näytönohjain";
      expect(extractGpu(description)).toBe('Geforce GTX 1650');
    });

    it('should extract RTX 3060 from Legion gaming laptop listing', () => {
      const description = "Erittäin tehokas ja moderni Legion 5 ei jätä toivomisen varaa ja sopii taatusti vaativimmallekkin pelaajalle ja tehokäyttäjälle!\n\nTällä Lenovon modernilla parempaan Legion-pelikoneluokkaan kuuluvalla kannettavalla pelaat uudetkin pelit sulavasti koneen omalla tarkalla ja responsiivisella näytöllä\n\nKiitos hillityn muotoilun, tehokkaan jäähdytyksensä ja teho-ominaisuuksiensa vuoksi soveltuu Legion 5 loistavasti myös vaativaan opiskelu-, ja työkäyttöön.\n\nReilusti tehoa koneeseen tuovat erittäin vääntävä 8-Ydin Ryzen 7 5800H prosessori, uusimmatkin pelit pyörittävä RTX3060 näytönohjain, sekä 16GB keskusmuistia.\nTallennustila koneesta ei myöskään heti lopu kesken, kiitos nopeakäyttöisen ja tilavan 1000GB m.2 SSD-levyn.\n\nTehokkaan paketin kruunaa tarkka 1440p-näyttö G-Sync tuella ja sulavalla 165Hz virkistystaajuudella.\n\nKunto: A, vain kevyttä kulumaa koneen kannessa, muuten täysin uudenveroinen.\nAkkukesto: ~4-6h+ peruskäytössä (peli/tehokäyttöä suositellaan vain piuhan päässä)\nMalli: Lenovo Legion 5 15ACH6H\nKäyttöjärjestelmä: Windows 11\nNäyttö: 15,6 tuumaa, 165Hz 2560x1440p heijastussuojattu IPS-paneeli, G-Sync, 100% sRGB, 300 nits\nNäytönohjain: RTX 3060 6GB\nProsessori: AMD Ryzen 7 5800H 8C/16T @ 2.80-4.20GHz\nKeskusmuisti: 16GB 3200MHz DDR4\nSSD-levy: 1000GB PCIe NVMe m.2 (Vapaana yksi m2 paikka)\nNäyttöliitännät: HDMI, USB-C(DP)\nLiitännät: 4x USB3, 2x USB-C, 1x audio\nVerkkoyhteys: Wifi, LAN\nWebcam\nBluetooth\nColdfront 3.0 - kaksoisjäähdytys\n\nTakuu: 12kk\nMarginaaliverotus 0%, hintaan ei lisätä arvonlisäveroa.\n\nKoneeseen on asennettu Windows 11 päivityksineen ja perusohjelmat käyttöä varten, kuten nettiselaimet ja toimisto-ohjelmisto.\n\nTäysin huollettu käytetty pelikannettava on varma valinta, jonka hinta/teho-suhde on vertaansa vailla.\n\nKäytetty pelikannettava on loistava vaihtoehto kun etsit hyvää hinta/laatu-suhdetta.\nKaikki pelikoneemme asennetaan ja testataan kattavasti ennen myyntiä, joten ne ovat aina heti valmiita kovempaankin käyttöön.\nOstamalla GT-PC:ltä käytetyn pelitietokoneen saat enemmän vastinetta rahoillesi ja tuet samalla kiertotaloutta!\n\nMeille voit myös jättää ylimääräiset IT-laitteesi (rikkinäiset ja ehjät) kierrätykseen koneen noudon yhteydessä!";
      expect(extractGpu(description)).toBe('RTX 3060');
    });

    it('should extract Quadro P2000 from Lenovo ThinkPad workstation listing', () => {
      const description = "💻 Lenovo ThinkPad P52 – tehokas kannettava työasema✅ Näyttö: 15,6\" FHD (1920x1080)✅ Suoritin: Intel Core i7-8850H (6 ydintä / 12 säiettä)✅ Näytönohjain: NVIDIA Quadro P2000 (4 Gt GDDR5) – soveltuu CAD-, 3D- ja graafiseen työskentelyyn✅ Muisti: 32 Gt DDR4 RAM✅ Tallennustila: 2 x 1 Tt SSD (yhteensä 2 Tt) – nopea käynnistys ja tallennus✅ Käyttöjärjestelmä: Windows 11 Pro✅ Akku: Hyvässä kunnossa 🖥 Lenovo ThinkPad Thunderbolt 4 Workstation Dock (sisältyy kauppaan)✔ Tukee jopa 4 x 4K-näyttöä tai 1 x 8K-näyttöä✔ Thunderbolt 4 – 40 Gbps nopea tiedonsiirto✔ 230 W virransyöttö – lataa ja käytä samalla✔ Monipuoliset liitännät: DisplayPort, HDMI, USB-C, USB-A, RJ-45 Ostettu Terasetiltä 29.9.2024. Voin ottaa lisää kuvia 👍hakusanat: tehokannettava, tehokone, työkone, teholäppäri, työasema   ************************************Nouto tai liikkuu myös Espoon, Lohjan ja Mäntsälän välillä omien menojeni mukaan. ***Katso myös muut ilmoitukseni – kaikenlaista tavaraa myynnissä, kaappien suursiivous käynnissä!***";
      expect(extractGpu(description)).toBe('Quadro P2000');
    });

    it('should return null for description without GPU info', () => {
      const description = "Kannettava tietokone myytävänä. Hyvä kunto. Intel i5 prosessori.";
      expect(extractGpu(description)).toBeNull();
    });
  });
});
describe('Description GPU Extraction - AMD Integrated', () => {
    it('should extract Radeon Graphics from Ryzen 7 PRO laptop listing', () => {
      const description = "Windows 11 ProAMD Ryzen 7 PRO 4750U with Radeon Graphics 1.70 GHz, 8 ydintä16 Gt RAM500 Gt SSD Ostettu 2021 opiskelua varten. Mukaan saa läppäriin sopivan telakan.";
      expect(extractGpu(description)).toBe('Ryzen 7 PRO 4750U with Radeon Graphics');
    });

    it('should extract Radeon Graphics from Ryzen 3 laptop listing', () => {
      const description = "Myydään käytetty läppäri. AMD Ryzen 3 5300U with Radeon Graphics, 16GB RAM, 512GB SSD";
      expect(extractGpu(description)).toBe('Ryzen 3 5300U with Radeon Graphics');
    });

    it('should extract Radeon Graphics from Ryzen 3 PRO laptop listing', () => {
      const description = "Lenovo ThinkPad, AMD Ryzen 3 PRO 5450U with Radeon Graphics, 8GB RAM, Windows 11";
      expect(extractGpu(description)).toBe('Ryzen 3 PRO 5450U with Radeon Graphics');
    });

    it('should extract Radeon Graphics from Ryzen 5 PRO desktop listing', () => {
      const description = "Tehokas työasema: AMD Ryzen 5 PRO 4400GE with Radeon Graphics, 32GB RAM, 1TB NVMe";
      expect(extractGpu(description)).toBe('Ryzen 5 PRO 4400GE with Radeon Graphics');
    });

    it('should extract Radeon Graphics from Ryzen 3 7000 series laptop', () => {
      const description = "Uusi kannettava: AMD Ryzen 3 7330U with Radeon Graphics, 16GB RAM, erittäin nopea";
      expect(extractGpu(description)).toBe('Ryzen 3 7330U with Radeon Graphics');
    });
  });
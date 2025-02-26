import { extractGpu } from '../../utils/gpuExtractor';

describe('GPU Information Extraction', () => {
  describe('Description GPU Extraction - NVIDIA', () => {
    it('should extract GeForce RTX 4080 from gaming laptop listing', () => {
      const description = "Peliläppäri on ostettu heinäkuussa 2023 gigantista ja käytetty pelaamiseen. Siinä ei ole mitään naarmuja tai käytönjälkijä. Se pyörittää kaikkiapelejä erittäin hyvin jopa 4k resolutiolla.Myyn sen koska olen käyttänyt sitä erittäin vähänviimeisen vuoden aikana eikä sille ole tarvetta tällähetkellä.Olen asentanut siihen toisen ssa levyn eli siina on nyt 2tb muistia.Alkuperainen hinta 2700€ + ssd noin 100€Alkuperäinen paketti ja kaikki siinä olevat tavarat ovat tallella (laturi jne.)Tuotetiedot:Intel® CoreTM j9-139OOHX -prosessoriNVIDIA GeForce RTX 4080 -näytönohjain(12gtvram)16 GB DDR5 RAM, 2 TB SSD-muisti 2560x1600 240hz  Nouto mieluummin tai postitus maksun jälkeen!Kuitti löytyy!Voi kysyä kuvista tai lisätiedoista.";
      expect(extractGpu(description)).toBe('GeForce RTX 4080');
    });

    it('should extract GeForce GTX 1650 from Lenovo laptop listing', () => {
      const description = "Hyvässä kunnossa oleva Lenovon Ideapadi, käytetty työ tietokoneena n 2 vuotta. Jäänyt vähälle käytölle. Tietokoonella pyörii todella hyvin kaikki FPS pelit cs, apex yms. Lisäkysymyksia yv. Prossesori AMD Ryzen 5 4600H with radeon graphicsRam 16 GB15,6 tuumainenNvidia Geforce GTX 1650 näytönohjain";
      expect(extractGpu(description)).toBe('GeForce GTX 1650');
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
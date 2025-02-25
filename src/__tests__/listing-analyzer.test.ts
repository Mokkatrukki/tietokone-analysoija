import { Database } from 'sqlite3';
import { ToriListing } from '../types/ToriListing';
import { createCpuTable, insertCpuSpec } from '../db/cpu-specs';
import { createGpuTables, insertGpuSpec, linkCpuToGpu } from '../db/gpu-specs';
import { analyzeListing } from '../listing-analyzer';

describe('Listing Analyzer', () => {
  let db: Database;

  beforeEach(async () => {
    // Create a new in-memory database for each test
    db = new Database(':memory:');
    
    // Create tables
    await createCpuTable(db);
    await createGpuTables(db);

    // Insert CPU data
    await insertCpuSpec(db, {
      name: 'Intel Core i5-8250U @ 1.60GHz',
      score: '5845',
      rank: '1807'
    });

    // Insert GPU data
    await insertGpuSpec(db, {
      name: 'Intel UHD Graphics 620',
      score: '1043',
      rank: '1163'
    });

    // Link CPU to integrated GPU
    await linkCpuToGpu(db, {
      cpu_name: 'Core i5-8250U',
      integrated_gpu_name: 'Intel UHD Graphics 620'
    });
  });

  afterEach((done) => {
    db.close(done);
  });

  it('should analyze ThinkPad T480 listing and find CPU and integrated GPU', async () => {
    const listing: ToriListing = {
      id: "6351114",
      url: "https://www.tori.fi/recommerce/forsale/item/6351114",
      title: "ThinkPad T480",
      categories: {
        full: "Tori / Elektroniikka ja kodinkoneet / Tietotekniikka / Kannettavat tietokoneet",
        levels: [
          "Tori",
          "Elektroniikka ja kodinkoneet",
          "Tietotekniikka",
          "Kannettavat tietokoneet"
        ],
        primary: "Elektroniikka ja kodinkoneet",
        secondary: "Tietotekniikka",
        tertiary: "Kannettavat tietokoneet"
      },
      price: 240,
      type: "myydään",
      description: "Prosessori intel i5 8250U muisti 16 Gb kiintolevy 256 Gb Näyttö 14\" 1920×1080 tehoakku,runko on lasikuituvahvistettua kierrätysmuovia,tehoakku,erittäin siisti kone.Win 11 Pro",
      additionalInfo: {
        Kunto: "Kuin uusi",
        Merkki: "Lenovo"
      },
      address: "20500, Turku, Vesilinna, Varsinais-Suomi",
      sellerType: "yksityinen",
      errors: []
    };

    const result = await analyzeListing(db, listing);
    
    expect(result).toEqual({
      cpu: {
        name: 'Intel Core i5-8250U @ 1.60GHz',
        score: '5845',
        rank: '1807'
      },
      gpu: {
        name: 'Intel UHD Graphics 620',
        score: '1043',
        rank: '1163'
      }
    });
  });
}); 
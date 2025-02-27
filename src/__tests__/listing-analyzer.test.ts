import { Database } from 'sqlite3';
import { ToriListing } from '../types/ToriListing';
import { HardwareSpecsDB } from '../db/hardware-specs';
import { analyzeListing } from '../listing-analyzer';

describe('Listing Analyzer', () => {
  let db: HardwareSpecsDB;

  beforeEach(() => {
    // Initialize test database
    db = HardwareSpecsDB.getInstance(true);

    // First insert CPU specs
    const cpuSpecs = [
      { name: 'Intel Core i5-8250U @ 1.60GHz', score: '5845', rank: '1807' }
    ];
    cpuSpecs.forEach(spec => db.upsertCpuSpec(spec));

    // Then insert GPU specs
    const gpuSpecs = [
      { name: 'Intel UHD Graphics 620', score: '1043', rank: '1163' }
    ];
    gpuSpecs.forEach(spec => db.upsertGpuSpec(spec));

    // Finally insert CPU-GPU mappings
    const mappings = [
      { cpu_name: 'Intel Core i5-8250U @ 1.60GHz', gpu_name: 'Intel UHD Graphics 620' }
    ];
    mappings.forEach(mapping => db.upsertCpuGpuMapping(mapping));
  });

  afterEach(() => {
    db.close();
    (HardwareSpecsDB['instance'] as any) = null;
  });

  it('should analyze ThinkPad T480 listing and find CPU and integrated GPU', () => {
    const listing: ToriListing = {
      id: 'test123',
      url: 'https://test.com/test123',
      title: 'ThinkPad T480',
      description: 'Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 16GB RAM, 512GB SSD.',
      price: 500,
      type: 'myydään',
      categories: {
        full: 'Electronics > Computers > Laptops',
        levels: ['Electronics', 'Computers', 'Laptops'],
        primary: 'Electronics',
        secondary: 'Computers',
        tertiary: 'Laptops'
      },
      additionalInfo: {},
      address: 'Test City',
      sellerType: 'yksityinen'
    };

    const result = analyzeListing(db, listing);
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
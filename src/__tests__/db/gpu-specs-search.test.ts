import { Database } from 'sqlite3';
import { createGpuTables, insertGpuSpec, searchGpuSpecs } from '../../db/gpu-specs';

describe('GPU Specs Search', () => {
  let db: Database;

  beforeEach(async () => {
    // Create a new in-memory database for each test
    db = new Database(':memory:');
    await createGpuTables(db);

    // Set up test data
    const testData = [
      { name: 'GeForce RTX 4090', score: '38429', rank: '1' },
      { name: 'GeForce RTX 5090', score: '38407', rank: '2' },
      { name: 'Intel Iris 5100', score: '740', rank: '1385' },
      { name: 'Radeon Vega 6 Ryzen 3 3350U', score: '1541', rank: '975' },
      { name: 'Radeon Vega 6 Ryzen 3 PRO 3300U w/', score: '1364', rank: '1034' },
      { name: 'Radeon Vega 6', score: '1308', rank: '1048' },
      { name: 'Radeon RX Vega 56', score: '13155', rank: '154' }
    ];

    // Insert test data
    for (const data of testData) {
      await insertGpuSpec(db, data);
    }
  });

  afterEach((done) => {
    db.close(done);
  });

  it('should find exact match for GeForce RTX 4090', async () => {
    const result = await searchGpuSpecs(db, 'GeForce RTX 4090');
    expect(result).toEqual({
      name: 'GeForce RTX 4090',
      score: '38429',
      rank: '1'
    });
  });

  it('should find partial match for RTX 4090', async () => {
    const result = await searchGpuSpecs(db, 'RTX 4090');
    expect(result).toEqual({
      name: 'GeForce RTX 4090',
      score: '38429',
      rank: '1'
    });
  });

  it('should return shortest name match for Radeon Vega 6', async () => {
    const result = await searchGpuSpecs(db, 'Radeon Vega 6');
    expect(result).toEqual({
      name: 'Radeon Vega 6',
      score: '1308',
      rank: '1048'
    });
  });


  //doesnt work correctly
  it('should find GPU by CPU model Ryzen 3 3300U', async () => {
    const result = await searchGpuSpecs(db, 'Ryzen 3 3300U');
    expect(result).toEqual({
      name: 'Radeon Vega 6 Ryzen 3 PRO 3300U w/',
      score: '1364',
      rank: '1034'
    });
  });

  it('should return null for unknown GPU', async () => {
    const result = await searchGpuSpecs(db, 'Unknown GPU Model');
    expect(result).toBeNull();
  });

  it('should return null for non-existent Radeon RX Vega 5', async () => {
    const result = await searchGpuSpecs(db, 'Radeon RX Vega 5');
    expect(result).toBeNull();
  });
}); 
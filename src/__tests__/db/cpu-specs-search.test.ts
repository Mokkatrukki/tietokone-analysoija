import { Database } from 'sqlite3';
import { createCpuTable, insertCpuSpec, searchCpuSpecs } from '../../db/cpu-specs';

describe('CPU Specs Search', () => {
  let db: Database;

  beforeEach(async () => {
    // Create a new in-memory database for each test
    db = new Database(':memory:');
    await createCpuTable(db);

    // Set up test data
    const testData = [
      { name: 'Intel Core i5-13500E', score: '28036', rank: '409' },
      { name: 'Intel Xeon W-2223 @ 3.60GHz', score: '8513', rank: '1389' },
      { name: 'Intel Core i5-2400S @ 2.50GHz', score: '3160', rank: '2499' },
      { name: 'AMD Phenom II X4 945', score: '2406', rank: '2865' },
      { name: 'Intel Core i5-6267U @ 2.90GHz', score: '3359', rank: '2412' }
    ];

    // Insert test data
    for (const data of testData) {
      await insertCpuSpec(db, data);
    }
  });

  afterEach((done) => {
    db.close(done);
  });

  it('should find exact match for i5-2400S', async () => {
    const result = await searchCpuSpecs(db, 'i5-2400S');
    expect(result).toEqual({
      name: 'Intel Core i5-2400S @ 2.50GHz',
      score: '3160',
      rank: '2499'
    });
  });

  it('should find match with full name Intel Core i5-13500E', async () => {
    const result = await searchCpuSpecs(db, 'Intel Core i5-13500E');
    expect(result).toEqual({
      name: 'Intel Core i5-13500E',
      score: '28036',
      rank: '409'
    });
  });

  it('should find match with partial model number 6267U', async () => {
    const result = await searchCpuSpecs(db, '6267U');
    expect(result).toEqual({
      name: 'Intel Core i5-6267U @ 2.90GHz',
      score: '3359',
      rank: '2412'
    });
  });

  it('should find AMD CPU with Phenom', async () => {
    const result = await searchCpuSpecs(db, 'Phenom');
    expect(result).toEqual({
      name: 'AMD Phenom II X4 945',
      score: '2406',
      rank: '2865'
    });
  });

  it('should return null for unknown CPU', async () => {
    const result = await searchCpuSpecs(db, 'Unknown CPU Model');
    expect(result).toBeNull();
  });
}); 
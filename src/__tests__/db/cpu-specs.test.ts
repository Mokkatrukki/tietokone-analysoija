import { Database } from 'sqlite3';
import { createCpuTable, insertCpuSpec, getCpuByName } from '../../db/cpu-specs';

describe('CPU Specs Database', () => {
  let db: Database;

  beforeAll(async () => {
    db = new Database(':memory:');
    await createCpuTable(db);
  });

  afterAll((done) => {
    db.close(done);
  });

  it('should insert and retrieve CPU specs', async () => {
    const cpuSpec = {
      name: "Intel Core i5-2540M @ 2.60GHz",
      cpu_mark: "2,369",
      rank: "2888"
    };

    await insertCpuSpec(db, cpuSpec);
    const result = await getCpuByName(db, "Intel Core i5-2540M @ 2.60GHz");

    expect(result).toEqual(cpuSpec);
  });

  it('should return null for non-existent CPU', async () => {
    const result = await getCpuByName(db, "Non-existent CPU");
    expect(result).toBeNull();
  });
}); 
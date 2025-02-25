import { Database } from 'sqlite3';
import { createGpuTables, insertGpuSpec, linkCpuToGpu, getIntegratedGpuForCpu } from '../../db/gpu-specs';
import { createCpuTable, insertCpuSpec } from '../../db/cpu-specs';

describe('GPU Specs Database', () => {
  let db: Database;

  beforeAll(async () => {
    db = new Database(':memory:');
    await createCpuTable(db);
    await createGpuTables(db);
  });

  afterAll((done) => {
    db.close(done);
  });

  it('should insert and retrieve GPU specs with CPU relation', async () => {
    // Insert CPU
    const cpuSpec = {
      name: "Intel Core i7-5650U @ 2.20GHz",
      cpu_mark: "2,369",
      rank: "2888"
    };
    await insertCpuSpec(db, cpuSpec);

    // Insert GPU
    const gpuSpec = {
      name: "Intel HD 6000",
      score: "347",
      rank: "1820"
    };
    await insertGpuSpec(db, gpuSpec);

    // Link CPU and GPU
    await linkCpuToGpu(db, {
      cpu_name: cpuSpec.name,
      integrated_gpu_name: gpuSpec.name
    });

    // Retrieve integrated GPU for CPU
    const result = await getIntegratedGpuForCpu(db, cpuSpec.name);
    expect(result).toEqual(gpuSpec);
  });

  it('should return null for CPU without integrated GPU', async () => {
    const result = await getIntegratedGpuForCpu(db, "Non-existent CPU");
    expect(result).toBeNull();
  });
}); 
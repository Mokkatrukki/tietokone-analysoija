import { Database } from 'sqlite3';
import { createGpuTables, linkCpuToGpu, getIntegratedGpuForCpu } from '../../db/gpu-specs';
import { createCpuTable } from '../../db/cpu-specs';

describe('Integrated GPU Search', () => {
  let db: Database;

  beforeEach(async () => {
    // Create a new in-memory database for each test
    db = new Database(':memory:');
    await createCpuTable(db);
    await createGpuTables(db);

    // Set up test data
    const testData = [
      { cpu_name: 'Core i3-2330M', integrated_gpu_name: 'Intel HD 3000' },
      { cpu_name: 'Core i3-7100U', integrated_gpu_name: 'Intel HD Graphics 620' },
      { cpu_name: 'Ryzen 3 5425C', integrated_gpu_name: 'Radeon RX Vega 6' }
    ];

    // Insert test data
    for (const data of testData) {
      await linkCpuToGpu(db, data);
    }
  });

  afterEach((done) => {
    db.close(done);
  });

  it('should find Intel HD 3000 for Core i3-2330M', async () => {
    const result = await getIntegratedGpuForCpu(db, 'Core i3-2330M');
    expect(result).toBe('Intel HD 3000');
  });
  it('should find Intel HD 3000 for i3-2330M', async () => {
    const result = await getIntegratedGpuForCpu(db, 'i3-2330M');
    expect(result).toBe('Intel HD 3000');
  });

  it('should find Intel HD Graphics 620 for Core i3-7100U', async () => {
    const result = await getIntegratedGpuForCpu(db, 'Core i3-7100U');
    expect(result).toBe('Intel HD Graphics 620');
  });

  it('should find Radeon RX Vega 6 for AMD Ryzen 3 5425C', async () => {
    const result = await getIntegratedGpuForCpu(db, 'Ryzen 3 5425C');
    expect(result).toBe('Radeon RX Vega 6');
  });

  it('should return null for unknown CPU', async () => {
    const result = await getIntegratedGpuForCpu(db, 'Unknown CPU Model');
    expect(result).toBeNull();
  });

}); 
import { Database } from 'sqlite3';
import { HardwareSpecsDB } from '../../../db/hardware-specs';

describe('Integrated GPU Search', () => {
  let db: HardwareSpecsDB;

  beforeEach(async () => {
    // Create a new in-memory database for each test
    db = HardwareSpecsDB.getInstance(true);

    // Set up test data
    const testData = [
      { cpu_name: 'Core i3-2330M', integrated_gpu_name: 'Intel HD 3000' },
      { cpu_name: 'Core i3-7100U', integrated_gpu_name: 'Intel HD Graphics 620' },
      { cpu_name: 'Ryzen 3 5425C', integrated_gpu_name: 'Radeon RX Vega 6' }
    ];

    // Insert test data
    for (const data of testData) {
      await db.upsertCpuGpuMapping(data);
    }
  });

  afterEach(async () => {
    await db.close();
    (HardwareSpecsDB['instance'] as any) = null; // Reset singleton for next test
  });

  it('should find Intel HD 3000 for Core i3-2330M', async () => {
    const result = await db.getIntegratedGpuForCpu('Core i3-2330M');
    expect(result).toBe('Intel HD 3000');
  });
  it('should find Intel HD 3000 for i3-2330M', async () => {
    const result = await db.getIntegratedGpuForCpu('i3-2330M');
    expect(result).toBe('Intel HD 3000');
  });

  it('should find Intel HD Graphics 620 for Core i3-7100U', async () => {
    const result = await db.getIntegratedGpuForCpu('Core i3-7100U');
    expect(result).toBe('Intel HD Graphics 620');
  });

  it('should find Radeon RX Vega 6 for AMD Ryzen 3 5425C', async () => {
    const result = await db.getIntegratedGpuForCpu('Ryzen 3 5425C');
    expect(result).toBe('Radeon RX Vega 6');
  });

  it('should return null for unknown CPU', async () => {
    const result = await db.getIntegratedGpuForCpu('Unknown CPU Model');
    expect(result).toBeNull();
  });
}); 
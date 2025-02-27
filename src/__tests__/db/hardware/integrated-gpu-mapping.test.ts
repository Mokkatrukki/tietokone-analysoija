import Database from 'better-sqlite3';
import { HardwareSpecsDB } from '../../../db/hardware-specs';

describe('Integrated GPU Search', () => {
  let db: HardwareSpecsDB;

  beforeEach(() => {
    // Create a new in-memory database for each test
    db = HardwareSpecsDB.getInstance(true);

    // First insert CPU specs
    const cpuSpecs = [
      { name: 'Core i3-2330M', score: '2000', rank: '2500' },
      { name: 'Core i3-7100U', score: '3500', rank: '1800' },
      { name: 'Ryzen 3 5425C', score: '8000', rank: '800' }
    ];
    cpuSpecs.forEach(spec => db.upsertCpuSpec(spec));

    // Then insert GPU specs
    const gpuSpecs = [
      { name: 'Intel HD 3000', score: '500', rank: '2000' },
      { name: 'Intel HD Graphics 620', score: '800', rank: '1500' },
      { name: 'Radeon RX Vega 6', score: '2000', rank: '1000' }
    ];
    gpuSpecs.forEach(spec => db.upsertGpuSpec(spec));

    // Finally insert the mappings
    const mappings = [
      { cpu_name: 'Core i3-2330M', gpu_name: 'Intel HD 3000' },
      { cpu_name: 'Core i3-7100U', gpu_name: 'Intel HD Graphics 620' },
      { cpu_name: 'Ryzen 3 5425C', gpu_name: 'Radeon RX Vega 6' }
    ];
    mappings.forEach(mapping => db.upsertCpuGpuMapping(mapping));
  });

  afterEach(() => {
    db.close();
    (HardwareSpecsDB['instance'] as any) = null; // Reset singleton for next test
  });

  it('should find Intel HD 3000 for Core i3-2330M', () => {
    const result = db.getIntegratedGpuForCpu('Core i3-2330M');
    expect(result).toBe('Intel HD 3000');
  });

  it('should find Intel HD 3000 for i3-2330M', () => {
    const result = db.getIntegratedGpuForCpu('i3-2330M');
    expect(result).toBe('Intel HD 3000');
  });

  it('should find Intel HD Graphics 620 for Core i3-7100U', () => {
    const result = db.getIntegratedGpuForCpu('Core i3-7100U');
    expect(result).toBe('Intel HD Graphics 620');
  });

  it('should find Radeon RX Vega 6 for AMD Ryzen 3 5425C', () => {
    const result = db.getIntegratedGpuForCpu('Ryzen 3 5425C');
    expect(result).toBe('Radeon RX Vega 6');
  });

  it('should return null for unknown CPU', () => {
    const result = db.getIntegratedGpuForCpu('Unknown CPU Model');
    expect(result).toBeNull();
  });
}); 
import { HardwareSpecsDB } from '../../../db/hardware-specs';
import { setupTestDatabase, cleanupTestDatabase } from '../../test-utils/test-db-setup';

describe('Integrated GPU Search', () => {
  let db: HardwareSpecsDB;

  beforeEach(() => {
    db = setupTestDatabase();
  });

  afterEach(() => {
    cleanupTestDatabase(db);
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
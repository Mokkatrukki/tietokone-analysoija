import { HardwareSpecsDB, ThinkpadModel } from '../db/hardware-specs';
import * as fs from 'fs';
import * as path from 'path';

describe('ThinkPad Models Database', () => {
  let db: HardwareSpecsDB;
  let testModels: ThinkpadModel[];

  beforeAll(() => {
    // Use in-memory database for testing
    db = HardwareSpecsDB.getInstance(true);
    
    // Create test data
    testModels = [
      {
        model: 'T480',
        windows11Compatible: true,
        specs: {
          directXVersion: '12',
          tpmVersion: '2.0',
          secureBootSupport: true
        }
      },
      {
        model: 'X220',
        windows11Compatible: false,
        specs: {
          directXVersion: '10.1',
          tpmVersion: '1.2',
          secureBootSupport: false
        }
      }
    ];

    // Insert test data
    testModels.forEach(model => {
      db.upsertThinkpadModel(model);
    });
  });

  afterAll(() => {
    db.close();
  });

  it('should retrieve a ThinkPad model by exact model name', () => {
    const model = db.searchThinkpadModel('T480');
    expect(model).not.toBeNull();
    expect(model?.model).toBe('T480');
    expect(model?.windows11Compatible).toBe(true);
    expect(model?.specs?.directXVersion).toBe('12');
    expect(model?.specs?.tpmVersion).toBe('2.0');
    expect(model?.specs?.secureBootSupport).toBe(true);
  });

  it('should retrieve a ThinkPad model by partial model name', () => {
    const model = db.searchThinkpadModel('X22');
    expect(model).not.toBeNull();
    expect(model?.model).toBe('X220');
    expect(model?.windows11Compatible).toBe(false);
  });

  it('should return null for non-existent model', () => {
    const model = db.searchThinkpadModel('NonExistentModel');
    expect(model).toBeNull();
  });

  it('should retrieve all Windows 11 compatible models', () => {
    const compatibleModels = db.getThinkpadModelsWithWin11Compatibility(true);
    expect(compatibleModels.length).toBe(1);
    expect(compatibleModels[0].model).toBe('T480');
  });

  it('should retrieve all Windows 11 incompatible models', () => {
    const incompatibleModels = db.getThinkpadModelsWithWin11Compatibility(false);
    expect(incompatibleModels.length).toBe(1);
    expect(incompatibleModels[0].model).toBe('X220');
  });

  it('should import models from JSON file', () => {
    // Create a temporary JSON file with test data
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const tempFilePath = path.join(tempDir, 'test-thinkpad-models.json');
    fs.writeFileSync(tempFilePath, JSON.stringify([
      {
        model: 'T490',
        windows11Compatible: true,
        specs: {
          directXVersion: '12',
          tpmVersion: '2.0',
          secureBootSupport: true
        }
      },
      {
        model: 'X230',
        windows11Compatible: false,
        specs: {
          directXVersion: '11.1',
          tpmVersion: '1.2',
          secureBootSupport: true
        }
      }
    ]));

    // Import the models
    const importModels = () => {
      const models = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8')) as ThinkpadModel[];
      models.forEach(model => {
        db.upsertThinkpadModel(model);
      });
      return models.length;
    };

    expect(importModels()).toBe(2);

    // Verify the models were imported
    const t490 = db.searchThinkpadModel('T490');
    expect(t490).not.toBeNull();
    expect(t490?.windows11Compatible).toBe(true);

    const x230 = db.searchThinkpadModel('X230');
    expect(x230).not.toBeNull();
    expect(x230?.windows11Compatible).toBe(false);

    // Clean up
    fs.unlinkSync(tempFilePath);
    if (fs.readdirSync(tempDir).length === 0) {
      fs.rmdirSync(tempDir);
    }
  });
}); 
import { HardwareSpecsDB } from '../db/hardware-specs';

// Create a new database instance
const db = HardwareSpecsDB.getInstance(false);

try {
  // Get all Windows 11 compatible ThinkPad models
  const win11CompatibleModels = db.getThinkpadModelsWithWin11Compatibility(true);
  console.log(`Found ${win11CompatibleModels.length} Windows 11 compatible ThinkPad models:`);
  win11CompatibleModels.slice(0, 5).forEach(model => {
    console.log(`- ${model.model} (TPM: ${model.specs?.tpmVersion}, DirectX: ${model.specs?.directXVersion}, Secure Boot: ${model.specs?.secureBootSupport})`);
  });
  console.log(`... and ${win11CompatibleModels.length - 5} more`);

  // Get all Windows 11 incompatible ThinkPad models
  const win11IncompatibleModels = db.getThinkpadModelsWithWin11Compatibility(false);
  console.log(`\nFound ${win11IncompatibleModels.length} Windows 11 incompatible ThinkPad models:`);
  win11IncompatibleModels.slice(0, 5).forEach(model => {
    console.log(`- ${model.model} (TPM: ${model.specs?.tpmVersion}, DirectX: ${model.specs?.directXVersion}, Secure Boot: ${model.specs?.secureBootSupport})`);
  });
  console.log(`... and ${win11IncompatibleModels.length - 5} more`);

  // Search for a specific model
  const t480 = db.searchThinkpadModel('T480');
  console.log('\nSearching for T480:');
  if (t480) {
    console.log(`- Model: ${t480.model}`);
    console.log(`- Windows 11 Compatible: ${t480.windows11Compatible}`);
    console.log(`- TPM Version: ${t480.specs?.tpmVersion}`);
    console.log(`- DirectX Version: ${t480.specs?.directXVersion}`);
    console.log(`- Secure Boot Support: ${t480.specs?.secureBootSupport}`);
  } else {
    console.log('T480 not found');
  }

  // Search for a model that doesn't exist
  const nonExistentModel = db.searchThinkpadModel('NonExistentModel');
  console.log('\nSearching for NonExistentModel:');
  if (nonExistentModel) {
    console.log(`- Model: ${nonExistentModel.model}`);
  } else {
    console.log('NonExistentModel not found');
  }
} catch (error) {
  console.error('Error:', error);
} finally {
  // Close the database connection
  db.close();
} 
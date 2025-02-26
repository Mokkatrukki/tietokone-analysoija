import { Database } from 'sqlite3';
import { createCpuTable, importCpuSpecs } from '../db/cpu-specs';
import * as fs from 'fs';
import * as path from 'path';

async function importCpuSpecsFromJson() {
  const db = new Database('cpu-specs.db');
  
  try {
    // Create the table
    await createCpuTable(db);
    
    // Read and parse the JSON file
    const jsonPath = path.join(__dirname, '../../cpu-specs.json');
    const cpuSpecs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    // Import the specs
    await importCpuSpecs(db, cpuSpecs);
    
    console.log('CPU specs imported successfully!');
  } catch (error) {
    console.error('Error importing CPU specs:', error);
  } finally {
    db.close();
  }
}

// Run the import
importCpuSpecsFromJson(); 
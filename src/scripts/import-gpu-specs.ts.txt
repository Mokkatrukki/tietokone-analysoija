import { Database } from 'sqlite3';
import { createGpuTables, insertGpuSpec, linkCpuToGpu } from '../db/gpu-specs';
import { createCpuTable } from '../db/cpu-specs';
import * as fs from 'fs';
import * as path from 'path';

interface GpuData {
  name: string;
  score: string;
  rank: string;
}

interface CpuGpuMapping {
  cpu_name: string;
  integrated_gpu_name: string;
}

async function importGpuSpecsFromJson() {
  const db = new Database('cpu-specs.db'); // Using same database file as CPU specs
  
  try {
    // Create tables
    await createCpuTable(db);
    await createGpuTables(db);
    
    // Read and parse the GPU specs JSON file
    const jsonPath = path.join(__dirname, '../../gpu-specs.json');
    const gpuSpecs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as GpuData[];
    
    // Import GPU specs
    console.log('Importing GPU specs...');
    for (const spec of gpuSpecs) {
      await insertGpuSpec(db, spec);
    }
    
    // Read and import CPU-GPU mappings if they exist
    try {
      const mappingPath = path.join(__dirname, '../../cpu-gpu-mappings.json');
      const mappings = JSON.parse(fs.readFileSync(mappingPath, 'utf-8')) as CpuGpuMapping[];
      
      console.log('Importing CPU-GPU mappings...');
      for (const mapping of mappings) {
        await linkCpuToGpu(db, mapping);
      }
      console.log('CPU-GPU mappings imported successfully!');
    } catch (error) {
      console.log('No CPU-GPU mappings file found or error importing mappings');
    }
    
    console.log('GPU specs imported successfully!');
  } catch (error) {
    console.error('Error importing GPU specs:', error);
  } finally {
    db.close();
  }
}

// Run the import
importGpuSpecsFromJson(); 
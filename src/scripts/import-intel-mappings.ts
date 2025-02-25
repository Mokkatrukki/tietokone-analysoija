import { Database } from 'sqlite3';
import { createGpuTables, linkCpuToGpu } from '../db/gpu-specs';
import { createCpuTable } from '../db/cpu-specs';
import * as fs from 'fs';
import * as path from 'path';

interface IntelMapping {
  gpu: string;
  processor: string[];
}

async function importIntelMappings() {
  const db = new Database('cpu-specs.db');
  
  try {
    // Create tables if they don't exist
    await createCpuTable(db);
    await createGpuTables(db);
    
    // Read and parse the Intel mappings file
    const jsonPath = path.join(__dirname, '../../intel-cpu-gpu.json');
    const mappings = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as IntelMapping[];
    
    console.log('Importing Intel CPU-GPU mappings...');
    
    // Process each GPU and its associated processors
    for (const mapping of mappings) {
      for (const processor of mapping.processor) {
        await linkCpuToGpu(db, {
          cpu_name: processor,
          integrated_gpu_name: mapping.gpu
        });
        console.log(`Linked ${processor} to ${mapping.gpu}`);
      }
    }
    
    console.log('Intel CPU-GPU mappings imported successfully!');
  } catch (error) {
    console.error('Error importing Intel mappings:', error);
  } finally {
    db.close();
  }
}

// Run the import
importIntelMappings(); 
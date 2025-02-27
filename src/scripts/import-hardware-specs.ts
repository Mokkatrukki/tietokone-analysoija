import { HardwareSpecsDB, CpuSpec, GpuSpec, CpuGpuMapping, normalizeCpuName } from '../db/hardware-specs';
import * as fs from 'fs';
import * as path from 'path';

// Types for data files
interface CpuData {
    name: string;
    cpu_mark: string;
    rank: string;
}

interface GpuData {
    name: string;
    score: string;
    rank: string;
}

interface IntelMapping {
    gpu: string;
    processor: string[];
}

/**
 * Import CPU specs from JSON file into hardware-specs database
 */
function importCpuSpecs(db: HardwareSpecsDB): void {
    try {
        const jsonPath = path.join(__dirname, '../../cpu-specs.json');
        const cpuSpecs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as CpuData[];
        
        console.log('Importing CPU specs...');
        for (const spec of cpuSpecs) {
            const cpuSpec: CpuSpec = {
                name: normalizeCpuName(spec.name),
                score: parseInt(spec.cpu_mark.replace(',', '')),
                rank: parseInt(spec.rank)
            };
            db.upsertCpuSpec(cpuSpec);
        }
        console.log('CPU specs imported successfully!');
    } catch (error) {
        console.error('Error importing CPU specs:', error);
        throw error;
    }
}

/**
 * Import GPU specs from JSON file into hardware-specs database
 */
function importGpuSpecs(db: HardwareSpecsDB): void {
    try {
        const jsonPath = path.join(__dirname, '../../gpu-specs.json');
        const gpuSpecs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as GpuData[];
        
        console.log('Importing GPU specs...');
        for (const spec of gpuSpecs) {
            const gpuSpec: GpuSpec = {
                name: spec.name,
                score: parseInt(spec.score),
                rank: parseInt(spec.rank)
            };
            db.upsertGpuSpec(gpuSpec);
        }
        console.log('GPU specs imported successfully!');
    } catch (error) {
        console.error('Error importing GPU specs:', error);
        throw error;
    }
}

/**
 * Import CPU-GPU mappings from intel-cpu-gpu.json - Intel processor to integrated GPU mappings
 */
function importCpuGpuMappings(db: HardwareSpecsDB): void {
    try {
        const intelPath = path.join(__dirname, '../../intel-cpu-gpu.json');
        if (!fs.existsSync(intelPath)) {
            console.log('Intel mappings file not found at:', intelPath);
            return;
        }

        const intelMappings = JSON.parse(fs.readFileSync(intelPath, 'utf-8')) as IntelMapping[];
        
        console.log('Importing Intel CPU-GPU mappings...');
        const missingCpus = new Set<string>();
        const missingGpus = new Set<string>();
        let importedCount = 0;

        for (const mapping of intelMappings) {
            // Check if GPU exists and log if missing
            const gpuSpec = db.searchGpuSpecs(mapping.gpu);
            if (!gpuSpec) {
                missingGpus.add(mapping.gpu);
                continue; // Skip this mapping if GPU doesn't exist
            }

            for (const processor of mapping.processor) {
                const normalizedCpuName = normalizeCpuName(processor);
                // Check if CPU exists and log if missing
                const cpuSpec = db.searchCpuSpecs(normalizedCpuName);
                if (!cpuSpec) {
                    missingCpus.add(processor);
                    continue; // Skip this mapping if CPU doesn't exist
                }

                try {
                    // Store the mapping with normalized CPU name and exact GPU name from database
                    db.upsertCpuGpuMapping({
                        cpu_name: normalizedCpuName,
                        gpu_name: gpuSpec.name // Use exact GPU name from database
                    });
                    importedCount++;
                } catch (err) {
                    console.error(`Failed to map CPU ${normalizedCpuName} to GPU ${gpuSpec.name}:`, err);
                }
            }
        }

        // Log summary
        console.log(`Intel CPU-GPU mappings import completed: ${importedCount} mappings imported`);
        if (missingCpus.size > 0) {
            console.log('CPUs not found in database:', Array.from(missingCpus));
        }
        if (missingGpus.size > 0) {
            console.log('GPUs not found in database:', Array.from(missingGpus));
        }
    } catch (error) {
        console.error('Error importing Intel mappings:', error);
        throw error;
    }
}

/**
 * Main function to import all hardware specs
 * Order of operations:
 * 1. Import CPU specs first as they are referenced by mappings
 * 2. Import GPU specs as they are also referenced by mappings
 * 3. Import CPU-GPU mappings last as they depend on both CPU and GPU specs
 */
function importAllSpecs(): void {
    // Create a new database instance for the import
    const db = HardwareSpecsDB.getInstance(false);
    
    try {
        importCpuSpecs(db);
        importGpuSpecs(db);
        importCpuGpuMappings(db);
        console.log('All hardware specs imported successfully!');
    } catch (error) {
        console.error('Failed to import all specs:', error);
    } finally {
        db.close();
    }
}

// Run the import
importAllSpecs(); 
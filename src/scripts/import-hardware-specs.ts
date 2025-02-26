import { hardwareSpecsDb, CpuSpec, GpuSpec, CpuGpuMapping } from '../db/hardware-specs';
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
async function importCpuSpecs(): Promise<void> {
    try {
        const jsonPath = path.join(__dirname, '../../cpu-specs.json');
        const cpuSpecs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as CpuData[];
        
        console.log('Importing CPU specs...');
        for (const spec of cpuSpecs) {
            const cpuSpec: CpuSpec = {
                name: spec.name,
                score: parseInt(spec.cpu_mark.replace(',', '')),
                rank: parseInt(spec.rank)
            };
            await hardwareSpecsDb.upsertCpuSpec(cpuSpec);
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
async function importGpuSpecs(): Promise<void> {
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
            await hardwareSpecsDb.upsertGpuSpec(gpuSpec);
        }
        console.log('GPU specs imported successfully!');
    } catch (error) {
        console.error('Error importing GPU specs:', error);
        throw error;
    }
}

/**
 * Import CPU-GPU mappings from both mapping files:
 * 1. cpu-gpu-mappings.json - Direct mappings
 * 2. intel-cpu-gpu.json - Intel processor to integrated GPU mappings
 */
async function importCpuGpuMappings(): Promise<void> {
    try {
        // Import direct mappings if they exist
        try {
            const mappingPath = path.join(__dirname, '../../cpu-gpu-mappings.json');
            const mappings = JSON.parse(fs.readFileSync(mappingPath, 'utf-8')) as CpuGpuMapping[];
            
            console.log('Importing CPU-GPU mappings...');
            for (const mapping of mappings) {
                await hardwareSpecsDb.upsertCpuGpuMapping({
                    cpu_name: mapping.cpu_name,
                    integrated_gpu_name: mapping.integrated_gpu_name
                });
            }
            console.log('CPU-GPU mappings imported successfully!');
        } catch (error) {
            console.log('No CPU-GPU mappings file found or error importing mappings');
        }

        // Import Intel mappings
        try {
            const intelPath = path.join(__dirname, '../../intel-cpu-gpu.json');
            const intelMappings = JSON.parse(fs.readFileSync(intelPath, 'utf-8')) as IntelMapping[];
            
            console.log('Importing Intel CPU-GPU mappings...');
            for (const mapping of intelMappings) {
                for (const processor of mapping.processor) {
                    await hardwareSpecsDb.upsertCpuGpuMapping({
                        cpu_name: processor,
                        integrated_gpu_name: mapping.gpu
                    });
                }
            }
            console.log('Intel CPU-GPU mappings imported successfully!');
        } catch (error) {
            console.log('No Intel mappings file found or error importing mappings');
        }
    } catch (error) {
        console.error('Error importing CPU-GPU mappings:', error);
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
async function importAllSpecs(): Promise<void> {
    try {
        await importCpuSpecs();
        await importGpuSpecs();
        await importCpuGpuMappings();
        console.log('All hardware specs imported successfully!');
    } catch (error) {
        console.error('Failed to import all specs:', error);
    } finally {
        await hardwareSpecsDb.close();
    }
}

// Run the import
importAllSpecs(); 
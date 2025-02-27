import { HardwareSpecsDB, normalizeCpuName } from '../../db/hardware-specs';

test('test', () => {
    true;
});
// Common test data
export const TEST_CPU_SPECS = [
    { name: 'Core i5-8250U', score: '5845', rank: '1807' },
    { name: 'Core i3-2330M', score: '2000', rank: '2500' },
    { name: 'Core i3-7100U', score: '3500', rank: '1800' },
    { name: 'Ryzen 3 5425C', score: '8000', rank: '800' },
    { name: 'Core i5-13500E', score: '28036', rank: '409' },
    { name: 'Core i5-2400S', score: '3160', rank: '2499' }
];

export const TEST_GPU_SPECS = [
    { name: 'Intel UHD Graphics 620', score: '1043', rank: '1163' },
    { name: 'Intel HD 3000', score: '500', rank: '2000' },
    { name: 'Intel HD Graphics 620', score: '800', rank: '1500' },
    { name: 'Radeon RX Vega 6', score: '2000', rank: '1000' },
    { name: 'GeForce RTX 4080', score: '38429', rank: '1' }
];

export const TEST_CPU_GPU_MAPPINGS = [
    { cpu_name: 'Core i5-8250U', gpu_name: 'Intel UHD Graphics 620' },
    { cpu_name: 'Core i3-2330M', gpu_name: 'Intel HD 3000' },
    { cpu_name: 'Core i3-7100U', gpu_name: 'Intel HD Graphics 620' },
    { cpu_name: 'Ryzen 3 5425C', gpu_name: 'Radeon RX Vega 6' }
];

export function setupTestDatabase(): HardwareSpecsDB {
    const db = HardwareSpecsDB.getInstance(true);

    // First insert CPU specs
    TEST_CPU_SPECS.forEach(spec => {
        db.upsertCpuSpec({
            ...spec,
            name: normalizeCpuName(spec.name)
        });
    });

    // Then insert GPU specs
    TEST_GPU_SPECS.forEach(spec => db.upsertGpuSpec(spec));

    // Finally insert CPU-GPU mappings
    TEST_CPU_GPU_MAPPINGS.forEach(mapping => {
        db.upsertCpuGpuMapping({
            cpu_name: normalizeCpuName(mapping.cpu_name),
            gpu_name: mapping.gpu_name
        });
    });

    return db;
}

export function cleanupTestDatabase(db: HardwareSpecsDB): void {
    if (db) {
        db.close();
        (HardwareSpecsDB['instance'] as any) = null;
    }
} 
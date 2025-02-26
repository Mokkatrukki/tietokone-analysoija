import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

// Types for hardware specs
export interface CpuSpec {
    name: string;
    score: string | number;
    rank: string | number;
    created_at?: string;
    updated_at?: string;
}

export interface GpuSpec {
    name: string;
    score: string | number;
    rank: string | number;
    created_at?: string;
    updated_at?: string;
}

export interface CpuGpuMapping {
    cpu_name: string;
    integrated_gpu_name: string;
}

// Helper function to normalize CPU names
export function normalizeCpuName(cpuName: string): string {
    // Remove "Intel " prefix if exists
    let normalized = cpuName.replace(/^Intel\s+/, '');
    // Remove frequency information if exists
    normalized = normalized.replace(/\s*@\s*\d+(\.\d+)?GHz/, '');
    // Trim any extra whitespace
    return normalized.trim();
}

// Helper function to clean timestamps from results
export function cleanTimestamps<T extends { created_at?: string; updated_at?: string }>(result: T | null): Omit<T, 'created_at' | 'updated_at'> | null {
    if (!result) return null;
    
    const { created_at, updated_at, ...cleanResult } = result;
    return cleanResult;
}

// Database setup class
export class HardwareSpecsDB {
    private db: Database;
    private static instance: HardwareSpecsDB;

    private constructor(useMemory = false) {
        // Use in-memory database for testing, file database for production
        const dbPath = useMemory ? ':memory:' : path.join(process.cwd(), 'hardware-specs.db');
        this.db = new sqlite3.Database(dbPath);
        this.initializeDatabase();
    }

    // Singleton pattern to ensure only one database connection
    public static getInstance(useMemory = false): HardwareSpecsDB {
        if (!HardwareSpecsDB.instance || useMemory) {
            HardwareSpecsDB.instance = new HardwareSpecsDB(useMemory);
        }
        return HardwareSpecsDB.instance;
    }

    private initializeDatabase(): void {
        this.db.serialize(() => {
            // Create CPU specs table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS cpu_specs (
                    name TEXT PRIMARY KEY,
                    score TEXT,
                    rank TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create GPU specs table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS gpu_specs (
                    name TEXT PRIMARY KEY,
                    score TEXT,
                    rank TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create CPU-GPU mappings table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS cpu_gpu_mappings (
                    cpu_name TEXT NOT NULL,
                    gpu_name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (cpu_name, gpu_name),
                    FOREIGN KEY (cpu_name) REFERENCES cpu_specs(name),
                    FOREIGN KEY (gpu_name) REFERENCES gpu_specs(name)
                )
            `);

            // Create indexes for better query performance
            this.db.run('CREATE INDEX IF NOT EXISTS idx_cpu_score ON cpu_specs(score)');
            this.db.run('CREATE INDEX IF NOT EXISTS idx_cpu_rank ON cpu_specs(rank)');
            this.db.run('CREATE INDEX IF NOT EXISTS idx_gpu_score ON gpu_specs(score)');
            this.db.run('CREATE INDEX IF NOT EXISTS idx_gpu_rank ON gpu_specs(rank)');
        });
    }

    // Method to insert or update a CPU spec
    public async upsertCpuSpec(spec: CpuSpec): Promise<void> {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO cpu_specs (name, score, rank)
                VALUES (?, ?, ?)
            `);

            stmt.run(
                spec.name,
                spec.score.toString(),
                spec.rank.toString(),
                (err: Error | null) => {
                    if (err) reject(err);
                    else resolve();
                }
            );

            stmt.finalize();
        });
    }

    // Method to insert or update a GPU spec
    public async upsertGpuSpec(spec: GpuSpec): Promise<void> {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO gpu_specs (name, score, rank)
                VALUES (?, ?, ?)
            `);

            stmt.run(
                spec.name,
                spec.score.toString(),
                spec.rank.toString(),
                (err: Error | null) => {
                    if (err) reject(err);
                    else resolve();
                }
            );

            stmt.finalize();
        });
    }

    // Method to insert or update a CPU-GPU mapping
    public async upsertCpuGpuMapping(mapping: CpuGpuMapping): Promise<void> {
        return new Promise((resolve, reject) => {
            const normalizedCpuName = normalizeCpuName(mapping.cpu_name);
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO cpu_gpu_mappings (cpu_name, gpu_name)
                VALUES (?, ?)
            `);

            stmt.run(
                normalizedCpuName,
                mapping.integrated_gpu_name,
                (err: Error | null) => {
                    if (err) reject(err);
                    else resolve();
                }
            );

            stmt.finalize();
        });
    }

    public async searchCpuSpecs(searchTerm: string): Promise<CpuSpec | null> {
        return new Promise((resolve, reject) => {
            const words = searchTerm.split(' ').filter(word => word.length > 0);
            const conditions = words.map(() => 'name LIKE ?').join(' AND ');
            const params = words.map(word => `%${word}%`);

            this.db.get<CpuSpec>(
                `SELECT * FROM cpu_specs WHERE ${conditions}`,
                params,
                (err, row) => {
                    if (err) reject(err);
                    else resolve(cleanTimestamps(row));
                }
            );
        });
    }

    public async searchGpuSpecs(searchTerm: string): Promise<GpuSpec | null> {
        return new Promise((resolve, reject) => {
            const words = searchTerm.split(' ').filter(word => word.length > 0);
            
            // Create conditions that handle numbers differently
            const conditions = words.map(word => {
                // If the word is a number or ends with a number, use exact matching
                if (/\d+$/.test(word)) {
                    // Match exact number boundaries with word boundaries
                    return '(name LIKE ? OR name LIKE ? OR name = ?)';
                }
                return 'name LIKE ?';
            }).join(' AND ');

            // Create parameters, tripling them for number words
            const params = words.flatMap(word => {
                if (/\d+$/.test(word)) {
                    // Add word boundaries around numbers
                    return [`% ${word} %`, `% ${word}`, `${word}`];
                }
                return [`%${word}%`];
            });

            this.db.get<GpuSpec>(
                `SELECT * FROM gpu_specs WHERE ${conditions} ORDER BY LENGTH(name) ASC LIMIT 1`,
                params,
                (err, row) => {
                    if (err) reject(err);
                    else resolve(cleanTimestamps(row));
                }
            );
        });
    }

    public async getIntegratedGpuForCpu(cpuName: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const normalizedCpuName = normalizeCpuName(cpuName);
            this.db.get<{ gpu_name: string }>(
                'SELECT gpu_name FROM cpu_gpu_mappings WHERE cpu_name LIKE ?',
                [`%${normalizedCpuName}%`],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.gpu_name : null);
                }
            );
        });
    }

    public async importCpuSpecs(specs: CpuSpec[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION');
                
                const stmt = this.db.prepare(
                    'INSERT OR REPLACE INTO cpu_specs (name, score, rank) VALUES (?, ?, ?)'
                );
                
                specs.forEach(spec => {
                    stmt.run(spec.name, spec.score.toString(), spec.rank.toString());
                });
                
                stmt.finalize();
                
                this.db.run('COMMIT', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }

    // Close the database connection
    public close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

// Export a singleton instance
export const hardwareSpecsDb = HardwareSpecsDB.getInstance(); 
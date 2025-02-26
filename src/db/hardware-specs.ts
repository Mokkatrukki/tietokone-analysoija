import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

// Types for hardware specs
export interface CpuSpec {
    name: string;
    score: number;
    rank: number;
}

export interface GpuSpec {
    name: string;
    score: number;
    rank: number;
}

export interface CpuGpuMapping {
    cpu_name: string;
    integrated_gpu_name: string;
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
        if (!HardwareSpecsDB.instance) {
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
                    score INTEGER NOT NULL,
                    rank INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create GPU specs table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS gpu_specs (
                    name TEXT PRIMARY KEY,
                    score INTEGER NOT NULL,
                    rank INTEGER NOT NULL,
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
                INSERT OR REPLACE INTO cpu_specs (name, score, rank, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            `);

            stmt.run(
                spec.name,
                spec.score,
                spec.rank,
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
                INSERT OR REPLACE INTO gpu_specs (name, score, rank, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            `);

            stmt.run(
                spec.name,
                spec.score,
                spec.rank,
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
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO cpu_gpu_mappings (cpu_name, gpu_name)
                VALUES (?, ?)
            `);

            stmt.run(
                mapping.cpu_name,
                mapping.integrated_gpu_name,
                (err: Error | null) => {
                    if (err) reject(err);
                    else resolve();
                }
            );

            stmt.finalize();
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
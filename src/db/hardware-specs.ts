import Database from 'better-sqlite3';
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
    gpu_name: string;
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
    private db: Database.Database;
    private static instance: HardwareSpecsDB;

    private constructor(useMemory = false) {
        // Use in-memory database for testing, file database for production
        const dbPath = useMemory ? ':memory:' : path.join(process.cwd(), 'hardware-specs.db');
        this.db = new Database(dbPath);
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
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS cpu_specs (
                name TEXT PRIMARY KEY,
                score TEXT,
                rank TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS gpu_specs (
                name TEXT PRIMARY KEY,
                score TEXT,
                rank TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS cpu_gpu_mappings (
                cpu_name TEXT NOT NULL,
                gpu_name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (cpu_name, gpu_name),
                FOREIGN KEY (cpu_name) REFERENCES cpu_specs(name),
                FOREIGN KEY (gpu_name) REFERENCES gpu_specs(name)
            )
        `);

        this.db.exec('CREATE INDEX IF NOT EXISTS idx_cpu_score ON cpu_specs(score)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_cpu_rank ON cpu_specs(rank)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_gpu_score ON gpu_specs(score)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_gpu_rank ON gpu_specs(rank)');
    }

    // Method to insert or update a CPU spec
    public upsertCpuSpec(spec: CpuSpec): void {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO cpu_specs (name, score, rank)
            VALUES (?, ?, ?)
        `);
        stmt.run(spec.name, spec.score.toString(), spec.rank.toString());
    }

    // Method to insert or update a GPU spec
    public upsertGpuSpec(spec: GpuSpec): void {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO gpu_specs (name, score, rank)
            VALUES (?, ?, ?)
        `);
        stmt.run(spec.name, spec.score.toString(), spec.rank.toString());
    }

    // Method to insert or update a CPU-GPU mapping
    public upsertCpuGpuMapping(mapping: CpuGpuMapping): void {
        const normalizedCpuName = normalizeCpuName(mapping.cpu_name);
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO cpu_gpu_mappings (cpu_name, gpu_name)
            VALUES (?, ?)
        `);
        stmt.run(normalizedCpuName, mapping.gpu_name);
    }

    public searchCpuSpecs(searchTerm: string): CpuSpec | null {
        const words = searchTerm.split(' ').filter(word => word.length > 0);
        const conditions = words.map(() => 'name LIKE ?').join(' AND ');
        const params = words.map(word => `%${word}%`);

        const row = this.db.prepare(`SELECT * FROM cpu_specs WHERE ${conditions}`).get(params);
        return cleanTimestamps(row as CpuSpec);
    }

    public searchGpuSpecs(searchTerm: string): GpuSpec | null {
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

        const row = this.db.prepare(`SELECT * FROM gpu_specs WHERE ${conditions} ORDER BY LENGTH(name) ASC LIMIT 1`).get(params);
        return cleanTimestamps(row as GpuSpec);
    }

    public getIntegratedGpuForCpu(cpuName: string): string | null {
        const normalizedCpuName = normalizeCpuName(cpuName);
        const row = this.db.prepare('SELECT gpu_name FROM cpu_gpu_mappings WHERE cpu_name LIKE ?')
            .get(`%${normalizedCpuName}%`) as { gpu_name: string } | undefined;
        return row ? row.gpu_name : null;
    }

    public importCpuSpecs(specs: CpuSpec[]): void {
        const stmt = this.db.prepare(
            'INSERT OR REPLACE INTO cpu_specs (name, score, rank) VALUES (?, ?, ?)'
        );
        
        const importMany = this.db.transaction((items: CpuSpec[]) => {
            for (const spec of items) {
                stmt.run(spec.name, spec.score.toString(), spec.rank.toString());
            }
        });

        importMany(specs);
    }

    // Close the database connection
    public close(): void {
        this.db.close();
    }
}

// Export a singleton instance
export const hardwareSpecsDb = HardwareSpecsDB.getInstance(); 
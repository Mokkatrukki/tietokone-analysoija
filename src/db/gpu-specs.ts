import { Database } from 'sqlite3';

export interface GpuSpec {
  name: string;
  score: string;
  rank: string;
}

export interface CpuGpuRelation {
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

export function createGpuTables(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create GPU specs table
      db.run(`
        CREATE TABLE IF NOT EXISTS gpu_specs (
          name TEXT PRIMARY KEY,
          score TEXT,
          rank TEXT
        )
      `);

      // Create CPU-GPU relation table with modified structure
      db.run(`
        CREATE TABLE IF NOT EXISTS cpu_gpu_relations (
          cpu_name TEXT,
          integrated_gpu_name TEXT,
          FOREIGN KEY (integrated_gpu_name) REFERENCES gpu_specs(name),
          PRIMARY KEY (cpu_name, integrated_gpu_name)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

export function insertGpuSpec(db: Database, spec: GpuSpec): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO gpu_specs (name, score, rank) VALUES (?, ?, ?)',
      [spec.name, spec.score, spec.rank],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function linkCpuToGpu(db: Database, relation: CpuGpuRelation): Promise<void> {
  return new Promise((resolve, reject) => {
    const normalizedCpuName = normalizeCpuName(relation.cpu_name);
    db.run(
      'INSERT OR REPLACE INTO cpu_gpu_relations (cpu_name, integrated_gpu_name) VALUES (?, ?)',
      [normalizedCpuName, relation.integrated_gpu_name],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function getIntegratedGpuForCpu(db: Database, cpuName: string): Promise<GpuSpec | null> {
  return new Promise((resolve, reject) => {
    const normalizedCpuName = normalizeCpuName(cpuName);
    db.get(
      `SELECT g.* 
       FROM gpu_specs g
       JOIN cpu_gpu_relations r ON g.name = r.integrated_gpu_name
       WHERE r.cpu_name = ?`,
      [normalizedCpuName],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row as GpuSpec : null);
      }
    );
  });
} 
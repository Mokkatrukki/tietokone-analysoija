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

interface GpuQueryResult {
  integrated_gpu_name: string;
}

/**
 * Extracts GPU model information from a text description.
 * Handles both discrete NVIDIA GPUs and AMD integrated graphics.
 * @param description - The text description to extract GPU information from
 * @returns The extracted GPU model name or null if not found
 */
export function getIntegratedGpuForCpu(db: Database, cpuName: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const normalizedCpuName = normalizeCpuName(cpuName);
    db.get(
      'SELECT integrated_gpu_name FROM cpu_gpu_relations WHERE cpu_name LIKE ?',
      [`%${normalizedCpuName}%`],
      (err, row: GpuQueryResult | undefined) => {
        if (err) reject(err);
        else resolve(row ? row.integrated_gpu_name : null);
      }
    );
  });
}

export function searchGpuSpecs(db: Database, searchTerm: string): Promise<GpuSpec | null> {
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

    const query = `SELECT * FROM gpu_specs WHERE ${conditions} ORDER BY LENGTH(name) ASC LIMIT 1`;
    
    db.get(
      query,
      params,
      (err, row: GpuSpec | undefined) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
} 
import { Database } from 'sqlite3';

export interface CpuSpec {
  name: string;
  score: string;
  rank: string;
}

export function createCpuTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS cpu_specs (
        name TEXT PRIMARY KEY,
        score TEXT,
        rank TEXT
      )
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function insertCpuSpec(db: Database, spec: CpuSpec): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO cpu_specs (name, score, rank) VALUES (?, ?, ?)',
      [spec.name, spec.score, spec.rank],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function searchCpuSpecs(db: Database, searchTerm: string): Promise<CpuSpec | null> {
  return new Promise((resolve, reject) => {
    const words = searchTerm.split(' ').filter(word => word.length > 0);
    const conditions = words.map(() => 'name LIKE ?').join(' AND ');
    const params = words.map(word => `%${word}%`);

    db.get(
      `SELECT * FROM cpu_specs WHERE ${conditions}`,
      params,
      (err, row: CpuSpec | undefined) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

export function getCpuByName(db: Database, name: string): Promise<CpuSpec | null> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM cpu_specs WHERE name = ?',
      [name],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row as CpuSpec : null);
      }
    );
  });
}

export function importCpuSpecs(db: Database, specs: CpuSpec[]): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      const stmt = db.prepare(
        'INSERT OR REPLACE INTO cpu_specs (name, score, rank) VALUES (?, ?, ?)'
      );
      
      specs.forEach(spec => {
        stmt.run(spec.name, spec.score, spec.rank);
      });
      
      stmt.finalize();
      
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
} 
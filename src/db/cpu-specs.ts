import { Database } from 'sqlite3';

export interface CpuSpec {
  name: string;
  cpu_mark: string;
  rank: string;
}

export function createCpuTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS cpu_specs (
        name TEXT PRIMARY KEY,
        cpu_mark TEXT,
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
      'INSERT OR REPLACE INTO cpu_specs (name, cpu_mark, rank) VALUES (?, ?, ?)',
      [spec.name, spec.cpu_mark, spec.rank],
      (err) => {
        if (err) reject(err);
        else resolve();
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
        'INSERT OR REPLACE INTO cpu_specs (name, cpu_mark, rank) VALUES (?, ?, ?)'
      );
      
      specs.forEach(spec => {
        stmt.run(spec.name, spec.cpu_mark, spec.rank);
      });
      
      stmt.finalize();
      
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
} 
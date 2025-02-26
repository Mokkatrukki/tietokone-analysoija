import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

// Types for our listing data
export interface ListingCategories {
    full: string;
    levels: string[];
    primary: string;
    secondary: string;
    tertiary: string;
}

export interface AdditionalInfo {
    [key: string]: string;
}

export interface CpuAnalysis {
    name: string | null;
    score: number | null;
    rank: number | null;
}

export interface GpuAnalysis {
    name: string | null;
    score: number | null;
    rank: number | null;
}

export interface Listing {
    id: string;
    url: string;
    title: string;
    categories: ListingCategories;
    price: number;
    type: string;
    description: string;
    additionalInfo: AdditionalInfo;
    address: string;
    sellerType: string;
    // Analysis fields
    analyzed: boolean;  // Flag to track if listing has been analyzed
    cpuAnalysis: CpuAnalysis | null;
    gpuAnalysis: GpuAnalysis | null;
    createdAt: string;
    updatedAt: string;
}

interface DbRow {
    id: string;
    url: string;
    title: string;
    price: number;
    type: string;
    description: string;
    address: string;
    seller_type: string;
    categories_full: string;
    categories_primary: string;
    categories_secondary: string;
    categories_tertiary: string;
    additional_info: string;
    categories_levels: string;
    analyzed: number;
    created_at: string;
    updated_at: string;
}

// Database setup class
export class ListingsDB {
    private db: Database;
    private static instance: ListingsDB;

    private constructor(useMemory = false) {
        // Use in-memory database for testing, file database for production
        const dbPath = useMemory ? ':memory:' : path.join(process.cwd(), 'listings.db');
        this.db = new sqlite3.Database(dbPath);
        this.initializeDatabase();
    }

    // Singleton pattern to ensure only one database connection
    public static getInstance(useMemory = false): ListingsDB {
        if (!ListingsDB.instance) {
            ListingsDB.instance = new ListingsDB(useMemory);
        }
        return ListingsDB.instance;
    }

    private initializeDatabase(): void {
        this.db.serialize(() => {
            // Create the main listings table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS listings (
                    id TEXT PRIMARY KEY,
                    url TEXT NOT NULL,
                    title TEXT NOT NULL,
                    price INTEGER,
                    type TEXT,
                    description TEXT,
                    address TEXT,
                    seller_type TEXT,
                    categories_full TEXT,
                    categories_primary TEXT,
                    categories_secondary TEXT,
                    categories_tertiary TEXT,
                    additional_info TEXT,  -- Stored as JSON
                    categories_levels TEXT,  -- Stored as JSON array
                    analyzed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create table for CPU analysis
            this.db.run(`
                CREATE TABLE IF NOT EXISTS cpu_analysis (
                    listing_id TEXT PRIMARY KEY,
                    name TEXT,
                    score INTEGER,
                    rank INTEGER,
                    FOREIGN KEY (listing_id) REFERENCES listings(id)
                )
            `);

            // Create table for GPU analysis
            this.db.run(`
                CREATE TABLE IF NOT EXISTS gpu_analysis (
                    listing_id TEXT PRIMARY KEY,
                    name TEXT,
                    score INTEGER,
                    rank INTEGER,
                    FOREIGN KEY (listing_id) REFERENCES listings(id)
                )
            `);

            // Create indexes for better query performance
            this.db.run('CREATE INDEX IF NOT EXISTS idx_listings_analyzed ON listings(analyzed)');
            this.db.run('CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price)');
            this.db.run('CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type)');
        });
    }

    // Method to insert or update a listing
    public async upsertListing(listing: Listing): Promise<void> {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO listings (
                    id, url, title, price, type, description, address, seller_type,
                    categories_full, categories_primary, categories_secondary, categories_tertiary,
                    additional_info, categories_levels, analyzed, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);

            stmt.run(
                listing.id,
                listing.url,
                listing.title,
                listing.price,
                listing.type,
                listing.description,
                listing.address,
                listing.sellerType,
                listing.categories.full,
                listing.categories.primary,
                listing.categories.secondary,
                listing.categories.tertiary,
                JSON.stringify(listing.additionalInfo),
                JSON.stringify(listing.categories.levels),
                listing.analyzed ? 1 : 0,
                (err: Error | null) => {
                    if (err) reject(err);
                    else resolve();
                }
            );

            stmt.finalize();
        });
    }

    // Method to update analysis results
    public async updateAnalysis(
        listingId: string,
        cpuAnalysis: CpuAnalysis | null,
        gpuAnalysis: GpuAnalysis | null
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Begin transaction
                this.db.run('BEGIN TRANSACTION');

                try {
                    // Update CPU analysis if provided
                    if (cpuAnalysis) {
                        const cpuStmt = this.db.prepare(`
                            INSERT OR REPLACE INTO cpu_analysis (listing_id, name, score, rank)
                            VALUES (?, ?, ?, ?)
                        `);
                        cpuStmt.run(listingId, cpuAnalysis.name, cpuAnalysis.score, cpuAnalysis.rank);
                        cpuStmt.finalize();
                    }

                    // Update GPU analysis if provided
                    if (gpuAnalysis) {
                        const gpuStmt = this.db.prepare(`
                            INSERT OR REPLACE INTO gpu_analysis (listing_id, name, score, rank)
                            VALUES (?, ?, ?, ?)
                        `);
                        gpuStmt.run(listingId, gpuAnalysis.name, gpuAnalysis.score, gpuAnalysis.rank);
                        gpuStmt.finalize();
                    }

                    // Mark listing as analyzed
                    this.db.run(
                        'UPDATE listings SET analyzed = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                        listingId
                    );

                    // Commit transaction
                    this.db.run('COMMIT', (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                } catch (error) {
                    this.db.run('ROLLBACK');
                    reject(error);
                }
            });
        });
    }

    // Method to get unanalyzed listings
    public async getUnanalyzedListings(): Promise<Listing[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM listings WHERE analyzed = 0',
                (err, rows: DbRow[]) => {
                    if (err) reject(err);
                    else {
                        const listings = rows.map(row => ({
                            id: row.id,
                            url: row.url,
                            title: row.title,
                            price: row.price,
                            type: row.type,
                            description: row.description,
                            address: row.address,
                            sellerType: row.seller_type,
                            additionalInfo: JSON.parse(row.additional_info),
                            categories: {
                                full: row.categories_full,
                                levels: JSON.parse(row.categories_levels),
                                primary: row.categories_primary,
                                secondary: row.categories_secondary,
                                tertiary: row.categories_tertiary
                            },
                            analyzed: row.analyzed === 1,
                            cpuAnalysis: null,
                            gpuAnalysis: null,
                            createdAt: row.created_at,
                            updatedAt: row.updated_at
                        }));
                        resolve(listings);
                    }
                }
            );
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
export const listingsDb = ListingsDB.getInstance(); 
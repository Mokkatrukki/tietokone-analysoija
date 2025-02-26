import { ListingsDB, Listing } from '../db/listings';

describe('ListingsDB', () => {
    let db: ListingsDB;

    const sampleListing: Listing = {
        id: "15668437",
        url: "https://www.tori.fi/recommerce/forsale/item/15668437?ci=2",
        title: "Thinkpad T14s Gen1 AMD",
        categories: {
            full: "Tori / Elektroniikka ja kodinkoneet / Tietotekniikka / Kannettavat tietokoneet",
            levels: [
                "Tori",
                "Elektroniikka ja kodinkoneet",
                "Tietotekniikka",
                "Kannettavat tietokoneet"
            ],
            primary: "Elektroniikka ja kodinkoneet",
            secondary: "Tietotekniikka",
            tertiary: "Kannettavat tietokoneet"
        },
        price: 390,
        type: "myydään",
        description: "Windows 11 ProAMD Ryzen 7 PRO 4750U with Radeon Graphics 1.70 GHz, 8 ydintä16 Gt RAM500 Gt SSD",
        additionalInfo: {
            "Kunto": "Hyvä",
            "Merkki": "Lenovo"
        },
        address: "00640, Helsinki, Oulunkylä-Patola, Uusimaa",
        sellerType: "yksityinen",
        analyzed: false,
        cpuAnalysis: null,
        gpuAnalysis: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    beforeEach(() => {
        db = ListingsDB.getInstance(true); // Use in-memory database
    });

    afterEach(async () => {
        await db.close();
        (ListingsDB['instance'] as any) = null; // Reset singleton for next test
    });

    it('should insert a new listing', async () => {
        await expect(db.upsertListing(sampleListing)).resolves.not.toThrow();
    });

    it('should get unanalyzed listings', async () => {
        await db.upsertListing(sampleListing);
        const unanalyzedListings = await db.getUnanalyzedListings();
        expect(unanalyzedListings).toHaveLength(1);
        expect(unanalyzedListings[0].id).toBe(sampleListing.id);
    });

    it('should update analysis results', async () => {
        await db.upsertListing(sampleListing);
        
        const cpuAnalysis = {
            name: "AMD Ryzen 7 PRO 4750U",
            score: 15000,
            rank: 50
        };

        const gpuAnalysis = {
            name: "AMD Radeon Graphics",
            score: 5000,
            rank: 100
        };

        await expect(db.updateAnalysis(
            sampleListing.id,
            cpuAnalysis,
            gpuAnalysis
        )).resolves.not.toThrow();

        // Verify the listing is now marked as analyzed
        const unanalyzedListings = await db.getUnanalyzedListings();
        expect(unanalyzedListings).toHaveLength(0);
    });
}); 
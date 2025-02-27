import { ListingsDB, Listing } from '../db/listings';

describe('ListingsDB', () => {
    let db: ListingsDB;
    const sampleListing: Listing = {
        id: 'test123',
        url: 'https://test.com',
        title: 'Test Laptop',
        categories: {
            full: 'Electronics > Computers > Laptops',
            levels: ['Electronics', 'Computers', 'Laptops'],
            primary: 'Electronics',
            secondary: 'Computers',
            tertiary: 'Laptops'
        },
        price: 500,
        type: 'sell',
        description: 'A test laptop',
        additionalInfo: {},
        address: 'Test City',
        sellerType: 'private',
        analyzed: false,
        cpuAnalysis: null,
        gpuAnalysis: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    beforeEach(() => {
        db = ListingsDB.getInstance(true);
    });

    afterEach(() => {
        db.close();
        (ListingsDB['instance'] as any) = null;
    });

    it('should insert a new listing', () => {
        expect(() => db.upsertListing(sampleListing)).not.toThrow();
    });

    it('should get unanalyzed listings', () => {
        db.upsertListing(sampleListing);
        const listings = db.getUnanalyzedListings();
        expect(listings).toHaveLength(1);
        expect(listings[0].id).toBe(sampleListing.id);
    });

    it('should update analysis results', () => {
        db.upsertListing(sampleListing);
        
        const cpuAnalysis = {
            name: 'Intel i5-8250U',
            score: 5845,
            rank: 1807
        };
        
        const gpuAnalysis = {
            name: 'Intel UHD 620',
            score: 1043,
            rank: 1163
        };

        expect(() => db.updateAnalysis(
            sampleListing.id,
            cpuAnalysis,
            gpuAnalysis
        )).not.toThrow();

        // Verify the listing is now marked as analyzed
        const unanalyzedListings = db.getUnanalyzedListings();
        expect(unanalyzedListings).toHaveLength(0);
    });
}); 
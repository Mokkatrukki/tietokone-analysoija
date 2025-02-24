import request from 'supertest';
import { app } from '../../index';
import { testListing, minimalValidListing } from '../../test/testData';

describe('Tori Listing API', () => {
  describe('POST /api/listings', () => {
    it('should accept a complete valid listing', async () => {
      const response = await request(app)
        .post('/api/listings')
        .send(testListing)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({ success: true });
    });

    it('should accept a minimal valid listing with only required fields', async () => {
      const response = await request(app)
        .post('/api/listings')
        .send(minimalValidListing)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({ success: true });
    });

    it('should reject when id is missing', async () => {
      const { id, ...listingWithoutId } = minimalValidListing;
      
      const response = await request(app)
        .post('/api/listings')
        .send(listingWithoutId)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details[0].field).toBe('id');
    });

    it('should reject when url is missing', async () => {
      const { url, ...listingWithoutUrl } = minimalValidListing;
      
      const response = await request(app)
        .post('/api/listings')
        .send(listingWithoutUrl)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details[0].field).toBe('url');
    });

    it('should reject when title is missing', async () => {
      const { title, ...listingWithoutTitle } = minimalValidListing;
      
      const response = await request(app)
        .post('/api/listings')
        .send(listingWithoutTitle)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details[0].field).toBe('title');
    });

    it('should reject when price is negative', async () => {
      const invalidListing = { ...minimalValidListing, price: -100 };
      
      const response = await request(app)
        .post('/api/listings')
        .send(invalidListing)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details[0].field).toBe('price');
      expect(response.body.details[0].message).toMatch(/non-negative/);
    });

    it('should reject when url format is invalid', async () => {
      const invalidListing = { ...minimalValidListing, url: 'not-a-url' };
      
      const response = await request(app)
        .post('/api/listings')
        .send(invalidListing)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details[0].field).toBe('url');
      expect(response.body.details[0].message).toMatch(/URL/);
    });
  });
});

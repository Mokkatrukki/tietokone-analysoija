import request from 'supertest';
import { app } from '../../index';
import { testListing, minimalValidListing, removeFields } from '../../test/testData';

describe('Tori Listing API', () => {
  describe('POST /api/listings', () => {
    it('should accept a complete valid listing', async () => {
      await request(app)
        .post('/api/listings')
        .send(testListing)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('should accept a minimal valid listing with only required fields', async () => {
      await request(app)
        .post('/api/listings')
        .send(minimalValidListing)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    describe('Required fields validation', () => {
      it('should reject when id is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['id']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('id');
      });

      it('should reject when url is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['url']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('url');
      });

      it('should reject when title is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['title']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('title');
      });
    });

    describe('Categories validation', () => {
      it('should reject when categories.full is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['categories.full']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('categories.full');
      });

      it('should reject when categories.levels is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['categories.levels']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('categories.levels');
      });

      it('should reject when categories.primary is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['categories.primary']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('categories.primary');
      });

      it('should reject when categories.secondary is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['categories.secondary']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('categories.secondary');
      });

      it('should reject when categories.tertiary is missing', async () => {
        const invalidListing = removeFields(minimalValidListing, ['categories.tertiary']);
        
        const response = await request(app)
          .post('/api/listings')
          .send(invalidListing)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details[0].field).toBe('categories.tertiary');
      });
    });

    describe('Field validation', () => {
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
});

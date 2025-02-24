import request from 'supertest';
import { app } from './index';
import { testListing } from './test/testData';

describe('Initial test setup', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});

describe('Tori Listing API', () => {
  it('should accept a valid listing and return 200 OK', async () => {
    const response = await request(app)
      .post('/api/listings')
      .send(testListing)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ success: true });
  });
});

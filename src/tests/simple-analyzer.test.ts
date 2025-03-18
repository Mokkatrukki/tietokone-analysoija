import request from 'supertest';
import { app } from '../index';

describe('Simple Analyzer API', () => {
  it('should analyze a listing with valid input', async () => {
    const testData = {
      url: 'https://www.example.com/listing',
      title: 'Lenovo ThinkPad X1 Carbon Intel i7-1165G7 16GB',
      specs: 'Processor: Intel Core i7-1165G7, Graphics: Intel Iris Xe, Display: 14" WQHD IPS, Memory: 16GB, Storage: 512GB SSD, OS: Windows 10 Pro',
      price: 899
    };

    const response = await request(app)
      .post('/api/simple-analysis')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.analysis).toBeDefined();
    
    // Check for expected CPU info
    if (response.body.analysis.cpu) {
      expect(response.body.analysis.cpu.name).toContain('i7-1165G7');
    }
    
    // Check for expected GPU info (integrated GPU in this case)
    if (response.body.analysis.gpu) {
      expect(response.body.analysis.gpu.isIntegrated).toBe(true);
    }
    
    // Check for screen info
    if (response.body.analysis.screen) {
      expect(response.body.analysis.screen.type).toContain('IPS');
    }
    
    // Check for OS info
    if (response.body.analysis.os) {
      expect(response.body.analysis.os.name).toContain('Windows 10');
    }
    
    // Check price and performance metrics
    expect(response.body.analysis.price).toBe(899);
    expect(response.body.analysis.performance).toBeDefined();
    expect(response.body.analysis.performance.totalScore).toBeGreaterThan(0);
    expect(response.body.analysis.value).toBeDefined();
    expect(response.body.analysis.value.totalPointsPerEuro).toBeGreaterThan(0);
  });

  it('should handle invalid input with appropriate error response', async () => {
    const invalidData = {
      url: 'not-a-valid-url',
      title: '',
      specs: 'Some specs',
      price: -100
    };

    const response = await request(app)
      .post('/api/simple-analysis')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
    expect(response.body.details.length).toBeGreaterThan(0);
  });

  it('should handle string price input', async () => {
    const testData = {
      url: 'https://www.example.com/listing',
      title: 'Dell XPS 15 i9-11900H RTX 3060',
      specs: 'Intel Core i9-11900H, NVIDIA RTX 3060, 32GB RAM, 1TB SSD',
      price: '1299€'
    };

    const response = await request(app)
      .post('/api/simple-analysis')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.analysis).toBeDefined();
    expect(response.body.analysis.price).toBe(1299);
  });
  
  it('should extract AMD Ryzen processor and GPU from gaming PC specs', async () => {
    const testData = {
      url: 'https://www.example.com/gaming-pc',
      title: 'Gaming PC Pelikone',
      specs: 'AMD Ryzen™ 5 5500 -prosessori, NVIDIA GeForce RTX 3050 -näytönohjain, 8 GB DDR4 RAM, 512 GB SSD-muisti, Windows 11',
      price: 799
    };

    const response = await request(app)
      .post('/api/simple-analysis')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.analysis).toBeDefined();
    
    // Check for AMD CPU
    if (response.body.analysis.cpu) {
      expect(response.body.analysis.cpu.name).toContain('Ryzen 5 5500');
    }
    
    // Check for NVIDIA GPU
    if (response.body.analysis.gpu) {
      expect(response.body.analysis.gpu.name).toContain('RTX 3050');
      expect(response.body.analysis.gpu.isIntegrated).toBe(false);
    }
    
    // Check for OS
    if (response.body.analysis.os) {
      expect(response.body.analysis.os.name).toContain('Windows 11');
    }
    
    // Check price and performance metrics
    expect(response.body.analysis.price).toBe(799);
    expect(response.body.analysis.performance).toBeDefined();
    expect(response.body.analysis.performance.totalScore).toBeGreaterThan(0);
    expect(response.body.analysis.value).toBeDefined();
    expect(response.body.analysis.value.totalPointsPerEuro).toBeGreaterThan(0);
  });
}); 
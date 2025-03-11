import { ToriListing } from '../types/ToriListing';
import { HardwareSpecsDB } from '../db/hardware-specs';
import { analyzeListing } from '../listing-analyzer';
import { setupTestDatabase, cleanupTestDatabase } from './test-utils/test-db-setup';

describe('Listing Analyzer', () => {
  let db: HardwareSpecsDB;

  beforeEach(() => {
    db = setupTestDatabase();
  });

  afterEach(() => {
    cleanupTestDatabase(db);
  });

  it('should analyze ThinkPad T480 listing and find CPU, integrated GPU, IPS screen, and 16GB RAM', () => {
    const listing: ToriListing = {
      id: 'test123',
      url: 'https://test.com/test123',
      title: 'ThinkPad T480',
      description: 'Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 16GB RAM, 512GB SSD. IPS-näyttö.',
      price: 500,
      type: 'myydään',
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
      additionalInfo: {},
      address: 'Test City',
      sellerType: 'yksityinen'
    };

    const result = analyzeListing(db, listing);
    expect(result).toEqual({
      cpu: {
        name: 'Core i5-8250U',
        score: '5845',
        rank: '1807',
        source: {
          foundInDescription: true,
          foundInTitle: false
        }
      },
      gpu: {
        name: 'Intel UHD Graphics 620',
        score: '1043',
        rank: '1163',
        source: {
          foundInDescription: true,
          foundInTitle: false,
          isIntegrated: true,
        }
      },
      screen: {
        type: 'IPS',
        source: {
          foundInTitle: false,
          foundInDescription: true
        }
      },
      memory: {
        sizeGB: 16,
        source: {
          foundInTitle: false,
          foundInDescription: true
        }
      },
      performance: {
        totalScore: 6888,
        cpuScore: 5845,
        gpuScore: 1043
      },
      value: {
        priceEur: 500,
        totalPointsPerEuro: 13.78,
        cpuPointsPerEuro: 11.69,
        gpuPointsPerEuro: 2.09
      }
    });
  });

  it('should calculate performance and value metrics with only CPU found, TN screen, and 8GB RAM', () => {
    const listing: ToriListing = {
      id: 'test456',
      url: 'https://test.com/test456',
      title: 'ThinkPad T480',
      description: 'Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 8 GB RAM, 512GB SSD. tn full hd',
      price: 450,
      type: 'myydään',
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
      additionalInfo: {},
      address: 'Test City',
      sellerType: 'yksityinen'
    };

    // Mock the GPU search to return null to simulate only CPU being found
    jest.spyOn(db, 'searchGpuSpecs').mockReturnValue(null);
    jest.spyOn(db, 'getIntegratedGpuForCpu').mockReturnValue(null);

    const result = analyzeListing(db, listing);
    expect(result).toEqual({
      cpu: {
        name: 'Core i5-8250U',
        score: '5845',
        rank: '1807',
        source: {
          foundInDescription: true,
          foundInTitle: false
        }
      },
      gpu: null,
      screen: {
        type: 'TN',
        source: {
          foundInTitle: false,
          foundInDescription: true
        }
      },
      memory: {
        sizeGB: 8,
        source: {
          foundInTitle: false,
          foundInDescription: true
        }
      },
      performance: {
        totalScore: 5845,
        cpuScore: 5845,
        gpuScore: null
      },
      value: {
        priceEur: 450,
        totalPointsPerEuro: 12.99,
        cpuPointsPerEuro: 12.99,
        gpuPointsPerEuro: null
      }
    });
  });

  it('should handle missing price for value calculation, no screen info, and no memory info', () => {
    const listing: ToriListing = {
      id: 'test789',
      url: 'https://test.com/test789',
      title: 'ThinkPad T480',
      description: 'Lenovo ThinkPad T480 kannettava tietokone. Intel Core i5-8250U prosessori, 1920x1080',
      // Set price as undefined with type assertion
      price: undefined as unknown as number,
      type: 'myydään',
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
      additionalInfo: {},
      address: 'Test City',
      sellerType: 'yksityinen'
    };

    const result = analyzeListing(db, listing);
    expect(result).toEqual({
      cpu: {
        name: 'Core i5-8250U',
        score: '5845',
        rank: '1807',
        source: {
          foundInDescription: true,
          foundInTitle: false
        }
      },
      gpu: {
        name: 'Intel UHD Graphics 620',
        score: '1043',
        rank: '1163',
        source: {
          foundInDescription: true,
          foundInTitle: false,
          isIntegrated: true,
        }
      },
      screen: null,
      memory: null,
      performance: {
        totalScore: 6888,
        cpuScore: 5845,
        gpuScore: 1043
      },
      value: null // Value should be null when price is missing
    });
  });

  it('should detect OLED screen from title and 16GB RAM from description', () => {
    const listing: ToriListing = {
      id: 'test101',
      url: 'https://test.com/test101',
      title: 'Samsung Galaxy Book Pro OLED',
      description: 'Samsung Galaxy Book Pro kannettava tietokone. Intel Core i7-1165G7, 16GB RAM, 512GB SSD.',
      price: 800,
      type: 'myydään',
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
      additionalInfo: {},
      address: 'Test City',
      sellerType: 'yksityinen'
    };

    // Mock the CPU and GPU search to return test values
    jest.spyOn(db, 'searchCpuSpecs').mockReturnValue({
      name: 'Core i7-1165G7',
      score: '10000',
      rank: '1000'
    });
    
    jest.spyOn(db, 'searchGpuSpecs').mockReturnValue({
      name: 'Intel Iris Xe Graphics',
      score: '2000',
      rank: '900'
    });

    const result = analyzeListing(db, listing);
    expect(result?.screen).toEqual({
      type: 'OLED',
      source: {
        foundInTitle: true,
        foundInDescription: false
      }
    });
    expect(result?.memory).toEqual({
      sizeGB: 16,
      source: {
        foundInTitle: false,
        foundInDescription: true
      }
    });
  });
}); 
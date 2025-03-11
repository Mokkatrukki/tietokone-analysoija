# Tori.fi Listing Analytics API

This API service analyzes laptop listings from Tori.fi, extracting and evaluating CPU and GPU specifications to help users make informed decisions about laptop purchases.

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd tori-pureskelija
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

### Submit a Listing for Analysis

**Endpoint:** `POST /api/listings`

Analyzes a Tori.fi listing by extracting and evaluating CPU and GPU specifications.

#### CORS Support

The API includes CORS support, allowing it to be accessed from web applications and Chrome extensions. By default, all origins are allowed.

#### Request Body

```json
{
  "id": "string",
  "url": "string",
  "title": "string",
  "price": number,
  "type": "string",
  "description": "string",
  "categories": {
    "full": "string",
    "levels": ["string"],
    "primary": "string",
    "secondary": "string",
    "tertiary": "string"
  },
  "additionalInfo": {
    // Additional metadata (optional)
  },
  "address": "string",
  "sellerType": "string"
}
```

#### Required Fields

- `id`: Unique identifier for the listing
- `url`: Valid URL of the Tori.fi listing
- `title`: Title of the listing
- `price`: Non-negative number representing the price
- `type`: Type of listing (e.g., "myydään")
- `description`: Full description of the listing

#### Example Request

```bash
curl -X POST http://localhost:3000/api/listings \
  -H "Content-Type: application/json" \
  -d '{
    "id": "12345",
    "url": "https://tori.fi/laptop-listing",
    "title": "HP Pavilion Gaming Laptop",
    "price": 599,
    "type": "myydään",
    "description": "Selling HP Pavilion Gaming Laptop with Intel i5-10300H processor and NVIDIA GTX 1650",
    "categories": {
      "full": "Tietokoneet > Kannettavat",
      "levels": ["Tietokoneet", "Kannettavat"],
      "primary": "Tietokoneet",
      "secondary": "Kannettavat",
      "tertiary": ""
    }
  }'
```

#### Successful Response (200 OK)

```json
{
  "success": true,
  "analysis": {
    "cpu": {
      "name": "Intel Core i7-10510U @ 1.80GHz",
      "score": "6533",
      "rank": "1674",
      "source": {
        "foundInDescription": false,
        "foundInTitle": true
      }
    },
    "gpu": {
      "name": "Intel UHD Graphics 620",
      "score": "1043",
      "rank": "1163",
      "source": {
        "foundInTitle": true,
        "foundInDescription": false,
        "isIntegrated": true
      }
    },
    "screen": {
      "type": "IPS",
      "source": {
        "foundInTitle": false,
        "foundInDescription": true
      }
    },
    "performance": {
      "totalScore": 7576,
      "cpuScore": 6533,
      "gpuScore": 1043
    },
    "value": {
      "priceEur": 599,
      "totalPointsPerEuro": 12.65,
      "cpuPointsPerEuro": 10.91,
      "gpuPointsPerEuro": 1.74
    }
  }
}
```

#### Performance and Value Metrics

The analysis now includes performance and value metrics:

- **Performance**:
  - `totalScore`: Combined CPU and GPU benchmark scores
  - `cpuScore`: CPU benchmark score as a number
  - `gpuScore`: GPU benchmark score as a number

- **Value**:
  - `priceEur`: Price in euros
  - `totalPointsPerEuro`: Total performance points per euro (higher is better)
  - `cpuPointsPerEuro`: CPU performance points per euro
  - `gpuPointsPerEuro`: GPU performance points per euro

#### Screen Type Information

The analysis now includes screen type information:

- **Screen**:
  - `type`: The type of screen (IPS, TN, OLED)
  - `source`: Information about where the screen type was found
    - `foundInTitle`: Whether the screen type was found in the listing title
    - `foundInDescription`: Whether the screen type was found in the listing description

This information helps users understand the display quality of the laptop, which is an important factor in the overall user experience.

#### Error Response (400 Bad Request)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "price",
      "message": "Price must be a non-negative number"
    }
  ]
}
```

## Development

### Running Tests

```bash
npm test
```

### API Documentation (Swagger)

The API documentation is available at `http://localhost:3000/api-docs` when running the development server.

### Chrome Extension Integration

The API includes CORS headers that allow it to be accessed directly from a Chrome extension. When developing a Chrome extension that communicates with this API:

1. Make sure to include the API's URL in your extension's permissions in the manifest.json file:
```json
"permissions": [
  "http://localhost:3000/",
  "https://your-production-api-url.com/"
]
```

2. Use standard fetch or XMLHttpRequest to communicate with the API:
```javascript
fetch('http://localhost:3000/api/listings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(listingData)
})
.then(response => response.json())
.then(data => {
  // Process the analysis results
  console.log(data.analysis);
});
```

## License

[Your License Here] 
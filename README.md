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
      "name": "Intel i5-10300H",
      "score": "8754",
      "rank": "Mid-range"
    },
    "gpu": {
      "name": "NVIDIA GTX 1650",
      "score": "6258",
      "rank": "Entry Gaming"
    }
  }
}
```

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

## License

[Your License Here] 
import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerDefinition: SwaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Tori.fi Listing Analytics API',
    version: '1.0.0',
    description: 'API for analyzing Tori.fi listings',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      ToriListing: {
        type: 'object',
        required: ['id', 'url', 'title', 'price', 'type', 'description'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the listing',
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'URL of the listing on Tori.fi',
          },
          title: {
            type: 'string',
            description: 'Title of the listing',
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Price of the item',
          },
          type: {
            type: 'string',
            description: 'Type of listing (e.g. "myydään")',
          },
          description: {
            type: 'string',
            description: 'Full description of the listing',
          },
          categories: {
            type: 'object',
            properties: {
              full: { type: 'string' },
              levels: { 
                type: 'array',
                items: { type: 'string' }
              },
              primary: { type: 'string' },
              secondary: { type: 'string' },
              tertiary: { type: 'string' }
            }
          },
          additionalInfo: {
            type: 'object',
            additionalProperties: true
          },
          address: { type: 'string' },
          sellerType: { type: 'string' },
          errors: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string'
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      },
      AnalyzerResult: {
        type: 'object',
        properties: {
          cpu: {
            type: 'object',
            properties: {
              name: { type: 'string', nullable: true },
              score: { type: 'string', nullable: true },
              rank: { type: 'string', nullable: true }
            }
          },
          gpu: {
            type: 'object',
            properties: {
              name: { type: 'string', nullable: true },
              score: { type: 'string', nullable: true },
              rank: { type: 'string', nullable: true }
            }
          }
        }
      }
    }
  },
  paths: {
    '/api/listings': {
      post: {
        tags: ['Listings'],
        summary: 'Submit a new Tori.fi listing for analysis',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ToriListing'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Listing successfully processed and analyzed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    analysis: {
                      $ref: '#/components/schemas/AnalyzerResult'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  }
}; 
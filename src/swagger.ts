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
      },
      AnalysisResult: {
        type: 'object',
        properties: {
          cpu: {
            type: 'object',
            nullable: true,
            properties: {
              name: { type: 'string' },
              score: { type: 'string' },
              rank: { type: 'string' },
              source: {
                type: 'object',
                properties: {
                  foundInDescription: { type: 'boolean' },
                  foundInTitle: { type: 'boolean' }
                }
              }
            }
          },
          gpu: {
            type: 'object',
            nullable: true,
            properties: {
              name: { type: 'string' },
              score: { type: 'string' },
              rank: { type: 'string' },
              source: {
                type: 'object',
                properties: {
                  foundInTitle: { type: 'boolean' },
                  foundInDescription: { type: 'boolean' },
                  isIntegrated: { type: 'boolean' }
                }
              }
            }
          },
          screen: {
            type: 'object',
            nullable: true,
            properties: {
              type: { type: 'string' },
              source: {
                type: 'object',
                properties: {
                  foundInTitle: { type: 'boolean' },
                  foundInDescription: { type: 'boolean' }
                }
              }
            }
          },
          memory: {
            type: 'object',
            nullable: true,
            properties: {
              sizeGB: { type: 'number' },
              source: {
                type: 'object',
                properties: {
                  foundInTitle: { type: 'boolean' },
                  foundInDescription: { type: 'boolean' }
                }
              }
            }
          },
          os: {
            type: 'object',
            nullable: true,
            properties: {
              name: { type: 'string' },
              source: {
                type: 'object',
                properties: {
                  foundInTitle: { type: 'boolean' },
                  foundInDescription: { type: 'boolean' }
                }
              }
            }
          },
          thinkpad: {
            type: 'object',
            nullable: true,
            properties: {
              model: { type: 'string' },
              source: {
                type: 'object',
                properties: {
                  foundInTitle: { type: 'boolean' },
                  foundInDescription: { type: 'boolean' }
                }
              }
            }
          },
          performance: {
            type: 'object',
            properties: {
              totalScore: { type: 'number' },
              cpuScore: { type: 'number', nullable: true },
              gpuScore: { type: 'number', nullable: true }
            }
          },
          value: {
            type: 'object',
            nullable: true,
            properties: {
              priceEur: { type: 'number' },
              totalPointsPerEuro: { type: 'number' },
              cpuPointsPerEuro: { type: 'number', nullable: true },
              gpuPointsPerEuro: { type: 'number', nullable: true }
            }
          }
        }
      }
    }
  },
  paths: {
    '/api/listings': {
      post: {
        summary: 'Analyze a Tori.fi listing',
        description: 'Analyzes a Tori.fi listing by extracting and evaluating CPU and GPU specifications',
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
            description: 'Successful analysis',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AnalysisResult'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
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
                          field: {
                            type: 'string'
                          },
                          message: {
                            type: 'string'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}; 
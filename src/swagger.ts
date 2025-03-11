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
          success: {
            type: 'boolean',
            description: 'Indicates if the analysis was successful'
          },
          analysis: {
            type: 'object',
            properties: {
              cpu: {
                type: 'object',
                nullable: true,
                properties: {
                  name: {
                    type: 'string',
                    description: 'CPU model name'
                  },
                  score: {
                    type: 'string',
                    description: 'CPU benchmark score'
                  },
                  rank: {
                    type: 'string',
                    description: 'CPU rank in benchmark database'
                  },
                  source: {
                    type: 'object',
                    properties: {
                      foundInDescription: {
                        type: 'boolean',
                        description: 'Whether CPU was found in listing description'
                      },
                      foundInTitle: {
                        type: 'boolean',
                        description: 'Whether CPU was found in listing title'
                      }
                    }
                  }
                }
              },
              gpu: {
                type: 'object',
                nullable: true,
                properties: {
                  name: {
                    type: 'string',
                    description: 'GPU model name'
                  },
                  score: {
                    type: 'string',
                    description: 'GPU benchmark score'
                  },
                  rank: {
                    type: 'string',
                    description: 'GPU rank in benchmark database'
                  },
                  source: {
                    type: 'object',
                    properties: {
                      foundInDescription: {
                        type: 'boolean',
                        description: 'Whether GPU was found in listing description'
                      },
                      foundInTitle: {
                        type: 'boolean',
                        description: 'Whether GPU was found in listing title'
                      },
                      isIntegrated: {
                        type: 'boolean',
                        description: 'Whether GPU is integrated with CPU'
                      }
                    }
                  }
                }
              },
              screen: {
                type: 'object',
                nullable: true,
                properties: {
                  type: { type: 'string', description: 'Screen type (IPS, TN, OLED)' },
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
                  totalScore: {
                    type: 'number',
                    description: 'Combined CPU and GPU benchmark score'
                  },
                  cpuScore: {
                    type: 'number',
                    nullable: true,
                    description: 'CPU benchmark score as a number'
                  },
                  gpuScore: {
                    type: 'number',
                    nullable: true,
                    description: 'GPU benchmark score as a number'
                  }
                }
              },
              value: {
                type: 'object',
                nullable: true,
                properties: {
                  priceEur: {
                    type: 'number',
                    description: 'Price in euros'
                  },
                  totalPointsPerEuro: {
                    type: 'number',
                    description: 'Total performance points per euro (value metric)'
                  },
                  cpuPointsPerEuro: {
                    type: 'number',
                    nullable: true,
                    description: 'CPU performance points per euro'
                  },
                  gpuPointsPerEuro: {
                    type: 'number',
                    nullable: true,
                    description: 'GPU performance points per euro'
                  }
                }
              }
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
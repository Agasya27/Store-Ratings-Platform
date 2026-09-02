const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Store Ratings Platform API',
      version: '1.0.0',
      description: 'REST API for the Store Ratings Platform coding challenge',
    },
    servers: [{ url: 'http://localhost:5003', description: 'Local dev' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'NORMAL', 'OWNER'] },
          },
        },
        Store: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            average_rating: { type: 'number' },
            user_rating: { type: 'integer', nullable: true },
          },
        },
        Error: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
  },
  apis: ['./src/docs/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

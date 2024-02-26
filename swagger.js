//import swagger module
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce APIs',
      version: '1.0.0',
      description: 'API documentation for Ecommerce Application',
    },
  },
  apis: ['./src/routes/*.js'], // Specify the path to your route files
};

const specs = swaggerJsdoc(options);
module.exports = specs;

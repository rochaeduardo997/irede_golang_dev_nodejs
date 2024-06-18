import swaggerJsDoc from 'swagger-jsdoc';
const swaggerSpecs = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movies",
      version: "1.0.0",
      description: ""
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "",
      },
    ],
  },
  apis: [`${__dirname}/infra/controller/**/*.ts`] // process @swagger in ./swagger.js and ./users.js
});

export default swaggerSpecs;
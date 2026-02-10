import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FloeHire API",
      version: "1.0.0",
      description: "API do sistema FloeHire",
    },
    servers: [
      {
        url: "http://localhost:3333",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/interfaces/https/routes/**/*.ts"],
});

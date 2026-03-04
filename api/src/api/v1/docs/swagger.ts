import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gantt Chart API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "/api/v1",
      },
    ],
  },
  apis: [path.join(process.cwd(), "src/**/*.yaml")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec
import { load } from "js-yaml";
import { readFileSync } from "node:fs";
import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";

const docsDir = path.join(process.cwd(), "src/api/v1/docs");

const loadYaml = (filePath: string) =>
  load(readFileSync(filePath, "utf8")) as Record<string, unknown>;

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
    components: {
      schemas: {
        // common
        ...loadYaml(`${docsDir}/components/schemas/common.schema.yaml`),
        
        // entities
        ...loadYaml(`${docsDir}/components/schemas/user.schema.yaml`),
        ...loadYaml(`${docsDir}/components/schemas/team.schema.yaml`),
        ...loadYaml(`${docsDir}/components/schemas/project.schema.yaml`),
        ...loadYaml(`${docsDir}/components/schemas/task.schema.yaml`),
      },
      securitySchemes: loadYaml(`${docsDir}/components/security.yaml`),
    },
  },
  apis: [path.join(process.cwd(), "src/**/*.yaml")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

import dotenv from "dotenv";
dotenv.config();

const requiredVars = [
  "NODE_ENV",
  "PORT",
  "GOOGLE_CLIENT_ID",
  "JWT_ACCESS_SECRET",
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.log("Required Environment Variable Missing: ", key);
  }
});

export const env = {
  node_env: String(process.env.NODE_ENV),
  port: Number(process.env.PORT),
  auth: {
    googleClientId: String(process.env.GOOGLE_CLIENT_ID),
  },
  db: {
    host: String(process.env.DB_HOST),
    name: String(process.env.DB_NAME),
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
  },
  jwtSecret: String(process.env.JWT_ACCESS_SECRET),
};

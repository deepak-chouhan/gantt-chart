import dotenv from "dotenv";
dotenv.config();

const requiredVars = [
  "NODE_ENV",
  "PORT",
  "GOOGLE_CLIENT_ID",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "RESEND_API_KEY",
  "INVITE_BASE_URL",
  "INVITE_EMAIL",
  "REDIS_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "BUCKET_NAME",
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
  jwt: {
    accessSecret: String(process.env.JWT_ACCESS_SECRET),
    refreshSecret: String(process.env.JWT_REFRESH_SECRET),
  },
  invite: {
    resendApiKey: String(process.env.RESEND_API_KEY),
    baseUrl: String(process.env.INVITE_BASE_URL),
    email: String(process.env.INVITE_EMAIL),
  },
  redisUrl: String(process.env.REDIS_URL),
  aws: {
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    bucketName: String(process.env.BUCKET_NAME),
  },
};

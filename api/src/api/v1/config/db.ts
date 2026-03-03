import { Pool } from "pg";
import { env } from "./env.js";

export const pool = new Pool({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    client.release();
  } catch (error) {
    console.error("Failed to connect to db");
    process.exit(1);
  }
};

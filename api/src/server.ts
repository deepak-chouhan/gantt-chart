import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./config/logger.js";
import { subscribeToRedis } from "./sse/sse.service.js";

subscribeToRedis();

await connectDB()
  .then(() => {
    console.log("Connected to DB");

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  })
  .catch((err) => logger.error(err));

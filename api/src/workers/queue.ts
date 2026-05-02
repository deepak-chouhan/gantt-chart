import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const jobQueue = new Queue("jobs", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  },
});

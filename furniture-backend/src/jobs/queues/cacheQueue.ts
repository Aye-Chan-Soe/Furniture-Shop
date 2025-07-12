import { Queue } from "bullmq";
import { redis } from "../../../config/redisClient";

export const cacheQueue = new Queue(
  "cache-invalidation", // redis channel = worker
  {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000, // wait 1 second, next 2s
      },
      removeOnComplete: true,
      removeOnFail: 1000,
    },
  }
);

export default cacheQueue;

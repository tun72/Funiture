import { Queue } from "bullmq";
import { redis } from "../../../config/redisClient";

const cacheQueue = new Queue("cache-invalidation", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

export default cacheQueue;

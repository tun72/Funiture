import { Worker } from "bullmq";
import "dotenv/config";

import { redis } from "../../../config/redisClient";

// Create Worker
export const cacheWorker = new Worker(
  "cache-invalidation",
  async (job) => {
    const { pattern } = job.data;
    await invalidateCache(pattern);
  },
  {
    connection: redis,
    concurrency: 5, // Process 5 jobs concurrency
  }
);

cacheWorker.on("completed", (job) => {
  console.log(`Job completed with result ${job.id}`);
});

cacheWorker.on("failed", (job: any, err) => {
  console.log(err);

  console.log(`Job failed with result ${job.id} and error - ${err}`);
});

const invalidateCache = async (pattern: string) => {
  try {
    const stream = redis.scanStream({
      match: pattern,
      count: 100,
    });

    const pipeline = redis.pipeline();
    let totalKeys = 0;

    // Process keys in batch
    stream.on("data", (keys: string[]) => {
      if (keys.length > 0) {
        keys.forEach((key) => {
          pipeline.del(key);
          totalKeys++;
        });
      }
    });

    await new Promise<void>((resolve, reject) => {
      stream.on("end", async () => {
        try {
          if (totalKeys > 0) await pipeline.exec();
          console.log(`Invalidated ${totalKeys} keys`);
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
  } catch (err) {
    console.log(`Cache validation error ${err}`);
  }
};

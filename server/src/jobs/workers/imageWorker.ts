import { Worker } from "bullmq";
import sharp from "sharp";

import path from "path";
import "dotenv/config";

import { redis } from "../../../config/redisClient";

// Create Worker
const imageWorker = new Worker(
  "imageOptimizeQueue",
  async (job) => {
    const { filePath, fileName, width, height, quality } = job.data;

    console.log(filePath);

    const optimizeImagePath = path.join(
      __dirname,
      "../../..",
      "/uploads/optimize",
      fileName
    );
    await sharp(filePath)
      .resize(width, height)
      .webp({ quality })
      .toFile(optimizeImagePath);
  },
  { connection: redis }
);

imageWorker.on("completed", (job) => {
  console.log(`Job completed with result ${job.id}`);
});

imageWorker.on("failed", (job: any, err) => {
  console.log(err);

  console.log(`Job failed with result ${job.id} and error - ${err}`);
});

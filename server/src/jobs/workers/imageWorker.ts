import { Worker } from "bullmq";

import { Redis } from "ioredis";

import sharp from "sharp";

import path from "path";
import "dotenv/config";

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  //   password
  maxRetriesPerRequest: null,
});

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
  { connection }
);

imageWorker.on("completed", (job) => {
  console.log(`Job completed with result ${job.id}`);
});

imageWorker.on("failed", (job: any, err) => {
  console.log(err);

  console.log(`Job failed with result ${job.id} and error - ${err}`);
});

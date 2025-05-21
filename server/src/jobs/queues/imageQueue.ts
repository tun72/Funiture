import { Queue } from "bullmq";
import { Redis } from "ioredis";
import "dotenv/config";
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  //   password
});

const ImageQueue = new Queue("imageOptimizeQueue", { connection });

export default ImageQueue;

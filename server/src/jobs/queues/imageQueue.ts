import { Queue } from "bullmq";
import { redis } from "../../../config/redisClient";

const ImageQueue = new Queue("imageOptimizeQueue", { connection: redis });

export default ImageQueue;

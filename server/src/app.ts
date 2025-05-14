import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { limiter } from "./middlewares/rateLimiter";

export const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()).use(helmet()).use(compression()).use(limiter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "In Good Condition ✅ " });
});

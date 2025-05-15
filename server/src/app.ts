import express, { Response, Request, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { limiter } from "./middlewares/rateLimiter";
import { check } from "./middlewares/check";
import healthRoute from "./routes/v1/health";

export const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()).use(helmet()).use(compression()).use(limiter);

app.use("/api/v1", healthRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Server Error";
  const errorCode = err.code || "Error_Code";
  res.status(status).json({ message, error: errorCode });
});

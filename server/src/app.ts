import express, { Response, Request, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { limiter } from "./middlewares/rateLimiter";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "node:path";

import routes from "./routes/v1/index";
import cron from "node-cron";

// controllers
import * as errorController from "./controllers/web/errorController";
import {
  createOrUpdateSettingStatus,
  getSettingStatus,
} from "./services/settingService";

export const app = express();

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src",
        "locales",
        "{{lng}}",
        "{{ns}}.json"
      ),
    },
    detection: {
      order: ["querystring", "cookie"],
      caches: ["cookie"],
    },
    fallbackLng: "en",
    preload: ["en", "mm"],
  });
app.use(middleware.handle(i18next));

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.static("public"));

let whitelist = ["http://example1.com", "http://localhost:5173"];
const corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or authorization header
};

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()).use(cookieParser());
app.use(cors(corsOptions)).use(helmet()).use(compression()).use(limiter);

app.use(routes);
app.use(errorController.notFound);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Server Error";
  const errorCode = err.code || "Error_Code";
  res.status(status).json({ message, error: errorCode });
});

cron.schedule("*/2 * * * *", async () => {
  console.log("running a taske every two minutes for testing purpose");
  const setting = await getSettingStatus("maintenance");
  if (setting!.value === "true") {
    await createOrUpdateSettingStatus("maintenance", "false");
    console.log("Now maintenance mode is off");
  }
});

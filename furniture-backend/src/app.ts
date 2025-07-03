import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
// import cron from "node-cron";
import { limiter } from "./middlewares/rateLimiter";
import routes from "./routes/v1/";

export const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

var whitelist = ["http://example1.com", "http://localhost:5173"];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    // Allow requests with no origin ( like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or authorization header
};

app
  .use(morgan("dev")) // HTTP request logger middleware
  .use(express.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
  .use(express.json()) // parse application/json
  .use(cookieParser()) // parse cookies
  .use(cors(corsOptions)) // cross-origin resource sharing
  .use(helmet()) // security middleware
  .use(compression()) // compress response bodies
  .use(limiter); // rate limiting middleware

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src/locales",
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

app.use(express.static("public"));
app.use(express.static("uploads")); // For public access

app.use(routes); // API routes

// Error handler middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  const errorCode = error.code || "INTERNAL_SERVER_ERROR";
  res.status(status).json({
    message,
    errorCode,
  });
});

// CRON Job
// cron.schedule("* * * * *", async () => {
//   console.log("Cron job running every minute for testing purposes");
//   // don't run any heavy tasks here
//   const setting = await getSettingStatus("maintenance");
//   if (setting?.value === "true") {
//     await createOrUpdateSettingStatus("maintenance", "false");
//     console.log("Maintenance mode disabled");
//   }
// });

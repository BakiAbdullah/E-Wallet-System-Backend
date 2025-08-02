import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./app/config/env.config";
import rateLimit from "express-rate-limit";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/NotFound";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport"; // Ensure passport strategies are loaded

const app = express();

// Middlewares
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Session management for passport.js
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 60, 
});

app.use(limiter);

// Base Route
app.use("/api/v1/", router);

// Welcome Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Digital Wallet System API!",
  });
});

// Error handling middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;

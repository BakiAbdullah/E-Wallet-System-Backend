import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./app/config/env.config";
import rateLimit from "express-rate-limit";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/NotFound";


const app = express();

// <<< Middlewares
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
});

app.use(limiter);
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to the Digital Wallet System API!"
    })
})

// Error handling middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;
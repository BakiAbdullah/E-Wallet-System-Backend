/* eslint-disable no-console */
import { Server } from "http";
import { app } from "./app";
import { envVars } from "./app/config/env.config";
import mongoose from "mongoose";

let server: Server;

const serverON = async () => {
    try {
      
        await mongoose.connect(envVars.DATABASE_URL as string);
        console.log("Connected to E-Wallet DB!✅");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening on port ${envVars.PORT} 🚀`);
    });
  } catch (error) {
    console.log(error);
  }
};

// IIFE function
(async () => {
  await serverON();
})();


//! Handling Signal termination
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// This is for manual termination of the server using Ctrl + C
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//! Handling unhandled rejection error & Promise
process.on("unhandledRejection", (err) => {
  console.log("unhandled Rejection detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//! Handling uncaught rejection error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
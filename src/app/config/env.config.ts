import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
}

const loadEnvVars = (): IEnvConfig => {
    const requiredEnvVars: string[] = [
        "PORT",
        "DATABASE_URL",
        "NODE_ENV"
    ]

    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production"
    }
}

export const envVars = loadEnvVars();
import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    FRONTEND_URL: string;
    BCRYPT_SALT_ROUNDS: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
}

const loadEnvVars = (): IEnvConfig => {
    const requiredEnvVars: string[] = [
        "PORT",
        "DATABASE_URL",
        "NODE_ENV",
        "FRONTEND_URL",
        "BCRYPT_SALT_ROUNDS",
        "JWT_EXPIRES_IN",
        "JWT_REFRESH_SECRET",
        "JWT_SECRET",
        "JWT_REFRESH_EXPIRES_IN"
    ]

    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    }
}

export const envVars = loadEnvVars();
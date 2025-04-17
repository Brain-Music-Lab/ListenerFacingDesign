import type { NextConfig } from "next";
import dotenv from "dotenv";

// Next.js project is in frontend folder. The .env file is one level up.
dotenv.config({
  path: "../.env"
})

const nextConfig: NextConfig = {
    env: {
        FASTAPI_PORT: process.env.FASTAPI_PORT
    }
};

export default nextConfig;

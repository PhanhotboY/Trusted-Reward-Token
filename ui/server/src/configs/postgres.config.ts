import { IPgConfig } from "../api/interfaces/config.interface";

export const pgConfig: Record<string, IPgConfig> = {
  development: {
    host: "localhost",
    port: 5433,
    user: "admin",
    password: "rewardsystem",
    database: "reward-system",
    dialect: "postgres",
  },
  production: {
    host: process.env.PG_HOST || "localhost",
    port: Number(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER || "admin",
    password: process.env.PG_PASSWORD || "rewardsystem",
    database: process.env.PG_DATABASE || "reward-system",
    dialect: "postgres",
  },
};

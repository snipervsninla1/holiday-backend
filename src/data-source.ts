import "reflect-metadata";
import { DataSource } from "typeorm";
import { initEnv } from "../configEnv";

initEnv();

const port = process.env.DB_PORT as number | undefined;
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  maxQueryExecutionTime: 1000,
  logging:
      process.env.NODE_ENV === "development"
          ? ["error", "warn", "migration", "schema"]
          : ["warn", "error", "migration"],
  logger: "advanced-console",

  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`]
});
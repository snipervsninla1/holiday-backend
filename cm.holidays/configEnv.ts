import dotenv from "dotenv";

export const initEnv = (): void => {
  dotenv.config({ path: __dirname + `/.env.${process.env.NODE_ENV}` });
};
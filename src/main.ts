import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import helmet from "helmet";
import { Security } from "./middlewares/security";
import cors from "cors";
import { allRoutes } from "./routes";
import { ErrorHandler, NotFound } from "./middlewares/errors/Api";

const app = express();
app
  .use(compression())
  .use(helmet({
    xssFilter: true,
    xContentTypeOptions: true
  }))
  .use(Security.xstAttackBlocker)
  .use(
    cors({
      origin: process.env.API_URL
    })
  )
  .use(express.urlencoded({ extended: true }))
  .use(express.json());

app.use("/api/v1/", allRoutes);

app.use((request: Request, response: Response, next: NextFunction) =>
  next(new NotFound(`Requested path ${request.path} not found`))
);

app.use(ErrorHandler.handle());

export { app };
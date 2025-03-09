import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncWrapper = (handler: AsyncFunction): any =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch((err) => next(err));
  };

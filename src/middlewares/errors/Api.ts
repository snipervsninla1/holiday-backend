import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}


class NotFound extends ApiError {
  constructor(path: string) {
    super(StatusCodes.BAD_REQUEST, path);
  }
}

class ErrorHandler {
  static handle = () => {
    return async (
      err: ApiError,
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      let statusCode =  err.statusCode || 500;
      if (err.name === "UnauthorizedError") statusCode = 401;
      res.status(statusCode).json({
        success: false,
        message: err.message,
        stack:
          process.env.NODE_ENV === "development"
            ? err.stack
            : undefined
      });
      next();
    };
  };
}

export { ApiError, ErrorHandler, NotFound };
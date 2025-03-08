import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
export class Security {
  static xstAttackBlocker (request: Request,
    response: Response,
    next: NextFunction): void {

    // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
    const allowedMethods = [
      "OPTIONS",
      "HEAD",
      "CONNECT",
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH"
    ];

    if (allowedMethods.includes(request.method)) {
      next();
    } else response.status(statusCode.METHOD_NOT_ALLOWED).send(`${request.method} not allowed.`);
  }
}
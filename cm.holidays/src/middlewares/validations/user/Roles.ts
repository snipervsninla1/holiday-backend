import { Request as JWTRequest } from "express-jwt";
import { NextFunction, Response } from "express";
import { USER_ROLE } from "../../../entities/types";
import { TokenPayload } from "../../../utils/types";
import { ApiError } from "../../errors/Api";
import { StatusCodes } from "http-status-codes";
import { toCamelCase } from "../../../utils/commons";

export const userHasRoles = (
  roles: (keyof typeof USER_ROLE)[],
  all = true
) => (
  request: JWTRequest,
  response: Response,
  next: NextFunction
): void  => {
  const {
    infos:
      {
        roles: userRoles,
        email
      }
    , id
  } = request.auth as TokenPayload;

  response.locals.roles = {};
  response.locals.user = {
    id,
    email
  };

  userRoles.forEach((role) => {
    response.locals.roles[`is${toCamelCase(role.type as string)}`] = true;
  });

  let finalVerdict: boolean;

  if (all) {
    finalVerdict = roles
      .every((role) => Boolean(response.locals.roles[`is${toCamelCase(role as string)}`]));
  } else {
    finalVerdict =  roles
      .some((role) => Boolean(response.locals.roles[`is${toCamelCase(role as string)}`]));
  }

  if (finalVerdict) {
    next();
  } else {
    next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        "This User cannot access to this resource")
    );
  }

};
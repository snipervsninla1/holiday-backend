import { NextFunction, Request, Response } from "express";
import { asyncWrapper } from "../requestHanlder";
import { RoleService } from "../../services/Role.service";
import { ApiError } from "../../middlewares/errors/Api";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../entities/Role";
import { COMMONS_ERRORS_CODES, RoleDTO } from "../../entities/types";

export class RoleController {
  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<string> {
    return await asyncWrapper(async () => {
      const {
        type,
        description
      } = request.body;
      const role = await RoleService.findRoleByType(type);

      if (role) {
        throw new ApiError(StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.CONFLICTS);
      }

      let roleToCreate = new Role();
      roleToCreate.type = type;
      roleToCreate.description = description;

      roleToCreate = await RoleService.create(roleToCreate);
      if (!roleToCreate) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          COMMONS_ERRORS_CODES.UNPROCESSABLE_OPERATION);
      }
      return response.status(StatusCodes.CREATED).send(roleToCreate.id);
    })(request, response, next);
  }

  static async getAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<RoleDTO[]>> {
    return await asyncWrapper(async () => {

      const { isAdmin, isHumanResource } = response.locals.roles;
      const roles = await RoleService.findAll(isAdmin || !isHumanResource);
      return response.status(StatusCodes.OK).json(roles);
    })(request, response, next);
  }
      
}
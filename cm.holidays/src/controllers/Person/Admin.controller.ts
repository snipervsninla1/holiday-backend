import { NextFunction, Request, Response } from "express";
import { asyncWrapper } from "../requestHanlder";
import { PersonController } from "./Person.controller";
import { Role } from "../../entities/Role";
import { USER_ROLE } from "../../entities/types";
import { RoleService } from "../../services/Role.service";

export class AdminController extends PersonController {

  static async createAdmin(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<string>> {
    return await asyncWrapper(async () => {

      const defaultRoles: Role[] = [
        {
          type: USER_ROLE.ADMIN,
          description: "Make configurations"
        },
        {
          type: USER_ROLE.EMPLOYEE,
          description: "Ask for holiday and manage it"
        },
        {
          type: USER_ROLE.HUMAN_RESOURCE,
          description: "Validate or Reject holiday, create employee and human resource also"
        }
      ].map((defaultRole) => {
        const role = new Role();
        role.type = defaultRole.type as USER_ROLE;
        role.description = defaultRole.description;
        return role;
      });

      for (const defaultRole of defaultRoles) {
        const role = await RoleService.findRoleByType(defaultRole.type);
        if (!role)
          await RoleService.create(defaultRole);
      }

      return await  PersonController.create({
        ...request,
        body: {
          ...request.body,
          roles: [defaultRoles.find((role) => role.type === USER_ROLE.ADMIN)]
            .filter(Boolean)
        }
      } as Request, response, next);
    })(request, response, next);
  }
}
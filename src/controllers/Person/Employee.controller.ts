import { PersonController } from "./Person.controller";
import { NextFunction, Request, Response } from "express";
import { asyncWrapper } from "../requestHanlder";
import { PersonService } from "../../services/Person.service";
import { ApiError } from "../../middlewares/errors/Api";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../entities/Role";
import { RoleService } from "../../services/Role.service";
import { SettingService } from "../../services/Setting.service";
import { Employee } from "../../entities/Employee";
import { regulariseSpacesFrom } from "../../utils/commons";
import { PostService } from "../../services/Post.service";
import { Post } from "../../entities/Post";
import {
  COMMONS_ERRORS_CODES,
  EMPLOYEE_ERRORS_CODES,
  EmployeeDTOForCreation,
  EmployeeTokenDTO, POST_ERRORS_CODES, ROLE_ERRORS_CODES,
  USER_ROLE
} from "../../entities/types";

export class EmployeeController extends PersonController {
  constructor() {
    super();
  }

  static async create(request: Request<EmployeeDTOForCreation>,
    response: Response,
    next: NextFunction): Promise<EmployeeTokenDTO> {
    return asyncWrapper(async () => {
      const {
        firstname,
        lastName,
        password,
        email,
        roles,
        posts
      } = request.body;
      const {
        isAdmin: creatorIsAdmin,
        isHumanResource: creatorIsHumanResource
      } = response.locals.roles;

      const employeeWithSameEmail = await PersonService.findByEmail(email);

      if (employeeWithSameEmail) {
        throw new ApiError(StatusCodes.CONFLICT,
          EMPLOYEE_ERRORS_CODES.EXISTED_EMAIL);
      }

      const employeeWithSameLastName = await PersonService
        .findByLastName(regulariseSpacesFrom(lastName));

      if (employeeWithSameLastName) {
        throw new ApiError(StatusCodes.CONFLICT,
          EMPLOYEE_ERRORS_CODES.EXISTED_LASTNAME);
      }

      const userToCreateRoles: Role[] = [];
      for (const role of roles) {
        const resultRole = await RoleService.findRoleById(role.id);
        if (resultRole) userToCreateRoles.push(resultRole);
      }

      if (userToCreateRoles.length !== roles.length) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          ROLE_ERRORS_CODES.NOT_FOUND);
      }

      const userWantedToBeCreateHasAdminRole = userToCreateRoles
        .find((userToCreateRole) => userToCreateRole.type === USER_ROLE.ADMIN);
      const userWantedToBeCreateHasHumanResourceRole = userToCreateRoles
        .find((userToCreateRole) =>
          userToCreateRole.type === USER_ROLE.HUMAN_RESOURCE);
      const userWantedToBeCreateHasEmployeeRole = userToCreateRoles
        .find((userToCreateRole) =>
          userToCreateRole.type === USER_ROLE.EMPLOYEE);

      const canCreateUser =
        (userWantedToBeCreateHasAdminRole && !!creatorIsAdmin) ||
        userWantedToBeCreateHasHumanResourceRole &&
        (!!creatorIsAdmin || !!creatorIsHumanResource) ||
        userWantedToBeCreateHasEmployeeRole &&
        (!!creatorIsAdmin || !!creatorIsHumanResource);

      if (!canCreateUser) {
        throw new ApiError(StatusCodes.UNAUTHORIZED,
          EMPLOYEE_ERRORS_CODES.UNAUTHORIZED);
      }

      const userPosts: Post[] = [];
      for (const post of posts) {
        const resultPost = await PostService.findById(post.id);
        if (resultPost) userPosts.push(resultPost);
      }

      if (!userPosts.every((userPost) => userPost.isActive)) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          POST_ERRORS_CODES.NOT_ACTIVE);
      }

      if (userPosts.length !== posts.length) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          COMMONS_ERRORS_CODES.BAD_REQUEST);
      }

      const userSetting = await SettingService.create({
        defaultEmailNotification: regulariseSpacesFrom(email, "").toLowerCase()
      });

      if (!userSetting) {
        throw new ApiError(StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.CONFLICTS);
      }

      let newEmployee: Employee | null = new Employee();
      newEmployee.firstname = regulariseSpacesFrom(firstname);
      newEmployee.lastName = regulariseSpacesFrom(lastName);
      newEmployee.password = password;
      newEmployee.email = regulariseSpacesFrom(email, "").toLowerCase();
      newEmployee.setting = userSetting;
      newEmployee.roles = userToCreateRoles;
      newEmployee.posts = userPosts;

      newEmployee = await PersonService.create(newEmployee);
      if (!newEmployee) {
        throw new ApiError(StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.CONFLICTS);
      }

      return response.status(StatusCodes.CREATED).json(newEmployee.id);
    })(request, request, next);
  }
}
import {
  COMMONS_ERRORS_CODES,
  EmployeeDTO,
  EmployeeDTOForCreation,
  EmployeeDTOForLogin,
  EmployeeTokenDTO,
  ROLE_ERRORS_CODES,
  USER_ROLE
} from "../../entities/types";
import { NextFunction, Request, Response } from "express";
import { PersonService } from "../../services/Person.service";
import { Auth } from "../../utils/auth";
import { ApiError } from "../../middlewares/errors/Api";
import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../requestHanlder";
import { Role } from "../../entities/Role";
import { RoleService } from "../../services/Role.service";
import { Employee } from "../../entities/Employee";
import { SettingService } from "../../services/Setting.service";
import { regulariseSpacesFrom } from "../../utils/commons";

export class PersonController {
  static async login(
    request: Request<EmployeeDTOForLogin>,
    response: Response,
    next: NextFunction
  ): Promise<Response<EmployeeTokenDTO>> {
    return await asyncWrapper(async () => {
      const person = await PersonService
        .findByEmail(regulariseSpacesFrom(request.body.email, ""));

      if (!person) {
        throw new ApiError(
          StatusCodes.NOT_FOUND, COMMONS_ERRORS_CODES.NOT_FOUND);
      }

      const areTheSame: boolean = await Auth.comparePassword(
        request.body.password,
        person.password
      );

      if (!areTheSame) {
        throw  new ApiError(
          StatusCodes.NOT_FOUND,
          COMMONS_ERRORS_CODES.NOT_FOUND
        );
      }

      return response.status(200).json({
        id: person.id,
        token: Auth.generateToken(person)
      });
    })(request, response, next);
  }

  static async create(request: Request<EmployeeDTOForCreation>,
    response: Response,
    next: NextFunction): Promise<EmployeeTokenDTO> {
    return asyncWrapper(async (): Promise<Response<EmployeeTokenDTO>> => {
      const { firstname, lastName, password, email, roles } = request.body;

      const person = await PersonService.findByEmail(email);

      if (person) {
        throw new ApiError(StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.CONFLICTS);
      }

      const existingRole: Role[] = [];
      for (const role of roles) {
        const resultRole = await RoleService.findRoleById(role.id);
        if (resultRole) existingRole.push(resultRole);
      }

      if (existingRole.length !== roles.length) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          ROLE_ERRORS_CODES.NOT_FOUND);
      }

      const setting = await SettingService.create({
        defaultEmailNotification: regulariseSpacesFrom(email, "").toLowerCase()
      });

      let newUser: Employee | null = new Employee();
      newUser.firstname = regulariseSpacesFrom(firstname);
      newUser.lastName = regulariseSpacesFrom(lastName);
      newUser.password = password;
      newUser.email = regulariseSpacesFrom(email, "").toLowerCase();
      newUser.setting = setting;
      newUser.roles = existingRole;

      newUser = await PersonService.create(newUser);
      if (!newUser) {
        throw new ApiError(StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.FAILED_OPERATION);
      }

      return response.status(StatusCodes.CREATED).json({
        id: newUser.id,
        token: Auth.generateToken(newUser)
      });
    })(request, request, next);
  }

  static async getById(
    request: Request,
    response: Response,
    next: NextFunction
  ) : Promise<Response<EmployeeDTO>> {
    return await asyncWrapper(
      async (): Promise<Response<EmployeeDTOForCreation>> => {
        const person = await PersonService.findUserById(request.params.id);
        if (!person) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            COMMONS_ERRORS_CODES.NOT_FOUND
          );
        }

        return response.status(StatusCodes.OK).json(person);
      })(request, response, next);
  }

  static async getAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<EmployeeDTO[]>> {
    return await asyncWrapper(async (): Promise<Response<EmployeeDTO>> => {

      const { isAdmin } = response.locals.roles;
      const persons = await PersonService.findAll();

      if (isAdmin) {
        return response.status(StatusCodes.OK).json(persons);
      }
      return response.status(StatusCodes.OK).json(
        persons
          .filter(person =>
            !person.roles.map((role) => role.type).includes(USER_ROLE.ADMIN))
          .map((person) => {
            return {
              ...person,
              roles: undefined
            };
          })
      );
    })(request, response, next);
  }

  static async updatePassword(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    return await asyncWrapper(async (): Promise<Response<void>> => {
      const { email } = response.locals.user;
      const { oldPassword, newPassword } = request.body;
      const person = await PersonService.findByEmail(email, false);
      if (!person) {
        throw  new ApiError(
          StatusCodes.NOT_FOUND,
          COMMONS_ERRORS_CODES.NOT_FOUND
        );
      }

      let areTheSame: boolean = await Auth.comparePassword(
        oldPassword, person.password);

      if (!areTheSame) {
        throw  new ApiError(
          StatusCodes.NOT_FOUND,
          COMMONS_ERRORS_CODES.WRONG_PASSWORD
        );
      }

      areTheSame = await Auth.comparePassword(newPassword, person.password);

      if (areTheSame) {
        throw  new ApiError(
          StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.PASSWORD_ARE_SAME
        );
      }
      person.password = newPassword;
      await PersonService.update(person);

      return response.sendStatus(StatusCodes.NO_CONTENT);
    })(request, response, next);
  }
}
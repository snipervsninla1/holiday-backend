import {
  COMMONS_ERRORS_CODES, EMPLOYEE_ERRORS_CODES, HOLIDAY_REQUEST_ERRORS_CODES,
  HOLIDAY_TYPE_ERRORS_CODES,
  HolidayRequestDTO,
  HolidayStatusDTO
} from "../../entities/types";
import { asyncWrapper } from "../requestHanlder";
import { NextFunction, Request, Response } from "express";
import { PersonService } from "../../services/Person.service";
import { ApiError } from "../../middlewares/errors/Api";
import { StatusCodes } from "http-status-codes";
import { HolidayRequestService } from "../../services/HolidayRequest.service";
import { HolidayRequest } from "../../entities/HolidayRequest";
import { HolidayTypeService } from "../../services/HolidayType.service";
import { EmailService } from "../../services/Email.service";
import { EMAIL_HOLIDAY_HTML_TEMPLATE } from "../../utils/templates/holidayAnswer";

export class HolidayRequestController {
  static async getAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<HolidayRequestDTO[]> {
    return await asyncWrapper(
      async ():
      Promise<Response<HolidayRequestDTO[]>> => {

        const {
          user: { email },
          roles: { isAdmin, isHumanResource }
        } = response.locals;

        const existingUser = await PersonService.findByEmail(email);

        if (!existingUser) {
          throw new ApiError(StatusCodes.NOT_FOUND,
            COMMONS_ERRORS_CODES.NOT_FOUND);
        }

        const holidayRequests: HolidayRequest[] = await HolidayRequestService
          .findByUserId(existingUser.id);
        if (isAdmin || isHumanResource) {
          holidayRequests
            .push(...await HolidayRequestService.findForAdminUser());
          return response.status(StatusCodes.OK).json(holidayRequests);
        }

        return response.status(StatusCodes.OK).json(holidayRequests);
      })(request, response, next);
  }

  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<HolidayRequestDTO[]> {
    return await asyncWrapper(async (): Promise<Response<string>> => {
      const {
        startingDate,
        endingDate,
        returningDate,
        description,
        type
      } = request.body;

      const {
        user: { id }
      } = response.locals;
      const existingEmployee = await PersonService.findUserById(id);

      if (!existingEmployee) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          COMMONS_ERRORS_CODES.NOT_FOUND);
      }

      const existingHolidayType = await HolidayTypeService.findById(type.id);

      if (!existingHolidayType) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          HOLIDAY_TYPE_ERRORS_CODES.NOT_FOUND);
      }

      const holidayRequestsWithSameStartingDate =
        await HolidayRequestService
          .findByUserIdAndStartingDate(id, startingDate);

      if (holidayRequestsWithSameStartingDate) {
        throw new ApiError(StatusCodes.CONFLICT,
          HOLIDAY_REQUEST_ERRORS_CODES.STARTING_DATE_ALREADY_EXIST);
      }

      let newHolidayRequest = new HolidayRequest();
      newHolidayRequest.type = existingHolidayType;
      newHolidayRequest.employee = existingEmployee;
      newHolidayRequest.status = HolidayStatusDTO.DRAFT;
      newHolidayRequest.returningDate = returningDate;
      newHolidayRequest.endingDate = endingDate;
      newHolidayRequest.startingDate = startingDate;
      newHolidayRequest.description = description;

      newHolidayRequest = await HolidayRequestService.create(newHolidayRequest);

      if (!newHolidayRequest) {
        throw new ApiError(StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.FAILED_OPERATION);
      }

      return response.status(StatusCodes.CREATED).json(newHolidayRequest.id);

    })(request, response, next);
  }

  static async updateStatus(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<HolidayRequestDTO[]> {
    return await asyncWrapper(async (): Promise<Response<string>> => {
      const { id, status } = request.params;
      const {
        roles: { isAdmin, isHumanResource },
        user: { id: userId }
      } = response.locals;

      const isKnownStatus = Object.keys(HolidayStatusDTO)
        .map((status) => status.toLowerCase())
        .includes(status.toLowerCase());

      if (
        !isKnownStatus
        || status.toLowerCase() === HolidayStatusDTO.DRAFT.toLowerCase()
        || !id
      ) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          COMMONS_ERRORS_CODES.UNPROCESSABLE_OPERATION);
      }

      const existingHolidayRequest = await HolidayRequestService.findById(id);

      if (!existingHolidayRequest) {
        throw new ApiError(StatusCodes.CONFLICT,
          HOLIDAY_REQUEST_ERRORS_CODES.NOT_FOUND);
      }

      const existingEmployee = await PersonService.findUserById(userId);

      if (!existingEmployee) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          COMMONS_ERRORS_CODES.NOT_FOUND);
      }

      if (existingHolidayRequest.status === HolidayStatusDTO.DRAFT
        && existingHolidayRequest.employee.id !== existingEmployee.id) {
        throw new ApiError(StatusCodes.UNAUTHORIZED,
          EMPLOYEE_ERRORS_CODES.UNAUTHORIZED);
      }

      const adminStatus = [
        HolidayStatusDTO.APPROVED.toLowerCase(),
        HolidayStatusDTO.REJECTED.toLowerCase()
      ];

      const otherStatus = [
        HolidayStatusDTO.PENDING.toLowerCase(),
        HolidayStatusDTO.DRAFT.toLowerCase()
      ];
      const cannotMakeBackOperation =
        adminStatus.includes(existingHolidayRequest.status.toLowerCase())
        && otherStatus.includes(status.toLowerCase());

      if (cannotMakeBackOperation) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          COMMONS_ERRORS_CODES.UNPROCESSABLE_OPERATION);
      }

      const isAdminOperation = adminStatus.includes(status.toLowerCase());

      const isOtherOperation =
        HolidayStatusDTO.PENDING.toLowerCase() === status.toLowerCase();

      const canMakeTheStatusChanged =
        (isAdminOperation && (isAdmin || isHumanResource))
        || isOtherOperation;

      if (!canMakeTheStatusChanged) {
        throw new ApiError(StatusCodes.UNAUTHORIZED,
          EMPLOYEE_ERRORS_CODES.UNAUTHORIZED);
      }

      if (isAdminOperation
        && existingHolidayRequest.status === HolidayStatusDTO.DRAFT) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          COMMONS_ERRORS_CODES.UNPROCESSABLE_OPERATION);
      }

      const prevStatus = existingHolidayRequest.status;
      existingHolidayRequest.status =
        HolidayStatusDTO[status as keyof typeof HolidayStatusDTO];

      await HolidayRequestService.update(existingHolidayRequest);
      if (adminStatus.includes(status.toLowerCase())) {
        const emailService = new EmailService(EMAIL_HOLIDAY_HTML_TEMPLATE(
          {
            ...existingHolidayRequest,
            description: undefined,
            employee: undefined,
            id: undefined
          },
          existingEmployee
        ));

        const errorMessage = await emailService.send();
        if (errorMessage) {
          existingHolidayRequest.status = prevStatus;
          await HolidayRequestService.update(existingHolidayRequest);

          throw new ApiError(StatusCodes.FAILED_DEPENDENCY, errorMessage);
        }
      }

      return response.status(StatusCodes.OK).json(existingHolidayRequest.id);

    })(request, response, next);
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    return await asyncWrapper(async (): Promise<void> => {
      const { id: holidayId } = request.params;
      const {
        startingDate,
        endingDate,
        returningDate,
        description,
        type
      } = request.body;


      const existingHolidayRequest =
        await HolidayRequestService.findById(holidayId);

      if (!existingHolidayRequest) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          COMMONS_ERRORS_CODES.NOT_FOUND);
      }

      if (existingHolidayRequest.status !== HolidayStatusDTO.DRAFT) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          COMMONS_ERRORS_CODES.UNPROCESSABLE_OPERATION);
      }

      if (type && type.id) {
        const existingHolidayType = await HolidayTypeService.findById(type.id);

        if (!existingHolidayType) {
          throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
            COMMONS_ERRORS_CODES.UNPROCESSABLE_OPERATION);
        }
        existingHolidayRequest.type = existingHolidayType;
      }

      if (returningDate) existingHolidayRequest.returningDate = returningDate;
      if (endingDate) existingHolidayRequest.endingDate = endingDate;
      if (startingDate) existingHolidayRequest.startingDate = startingDate;
      if (description) existingHolidayRequest.description = description;

      await HolidayRequestService.update(existingHolidayRequest);

      response.sendStatus(StatusCodes.NO_CONTENT);
    })(request, response, next);
  }

  static async getById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    return await asyncWrapper(async ():
    Promise<Response<HolidayRequestDTO>> => {
      const { id: holidayRequestId } = request.params;
      const holidayRequest: HolidayRequest | null =
        await HolidayRequestService.findById(holidayRequestId);
      if (!holidayRequest) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          COMMONS_ERRORS_CODES.NOT_FOUND
        );
      }
      const employee = holidayRequest.employee;
      return response.status(StatusCodes.OK).json({
        ...holidayRequest,
        employee: {
          ...employee,
          password: undefined,
          createdAt: undefined,
          updatedAt: undefined
        }
      });
    })(request, response, next);
  }
}
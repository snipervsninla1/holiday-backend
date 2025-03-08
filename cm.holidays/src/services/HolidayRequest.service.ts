import { AppDataSource } from "../data-source";
import { HolidayRequest } from "../entities/HolidayRequest";
import { HolidayStatusDTO } from "../entities/types";
import { Not } from "typeorm";

export class HolidayRequestService {
  private static holidayRequestRepository
    = AppDataSource.getRepository(HolidayRequest);

  static async findByUserId(userId: string): Promise<HolidayRequest[]> {
    return this.holidayRequestRepository.find({
      where: {
        employee: {
          id: userId
        }
      },
      relations: {
        type: true
      }
    });
  }

  static async findForAdminUser(): Promise<HolidayRequest[]> {
    return this.holidayRequestRepository.find({
      where: {
        status: Not(HolidayStatusDTO.DRAFT)
      }
    });
  }

  static async create(holidayRequest: HolidayRequest): Promise<HolidayRequest> {
    return this.holidayRequestRepository.save(holidayRequest);
  }

  static async findByUserIdAndStartingDate(
    userId: string,
    startingDate: string
  ): Promise<HolidayRequest | null> {
    return this.holidayRequestRepository.findOne({
      where: {
        employee: {
          id: userId
        },
        startingDate
      }
    });
  }

  static async findById(id: string): Promise<HolidayRequest | null> {
    return this.holidayRequestRepository.findOne({
      where: {
        id
      },
      relations: {
        employee: true
      }
    });
  }

  static async update(holidayRequest: HolidayRequest): Promise<void> {
    this.holidayRequestRepository.update({
      id: holidayRequest.id
    }, holidayRequest);
  }
}
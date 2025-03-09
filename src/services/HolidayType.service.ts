import { Repository } from "typeorm";
import { HolidayType } from "../entities/HolidayType";
import { AppDataSource } from "../data-source";

export class HolidayTypeService {
  private static holidayTypeManager: Repository<HolidayType>
    = AppDataSource.getRepository(HolidayType);

  static async findByName(name: string): Promise<HolidayType | null> {
    return this.holidayTypeManager
      .createQueryBuilder("t_holidayType")
      .where("LOWER(t_holidayType.name) = LOWER(:name)", { name })
      .getOne();
  }

  static async create(holidayType: HolidayType): Promise<HolidayType | null> {
    return this.holidayTypeManager.save(holidayType);
  }

  static async findAll(): Promise<HolidayType[]> {
    return this.holidayTypeManager.find();
  }

  static async findById(typeId: string): Promise<HolidayType | null> {
    return this.holidayTypeManager.findOne({
      where: {
        id: typeId
      }
    });
  }

}
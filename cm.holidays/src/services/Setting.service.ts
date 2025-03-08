import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Setting } from "../entities/Setting";
import { SettingDTO } from "../entities/types";

export class SettingService {
  private static settingManager: Repository<Setting>
    = AppDataSource.getRepository(Setting);

  static async create(setting: SettingDTO): Promise<Setting> {
    return this.settingManager.save(setting);
  }
}
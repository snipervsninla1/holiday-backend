import { Repository } from "typeorm";
import { Service } from "../entities/Service";
import { AppDataSource } from "../data-source";
import { ServiceDTO } from "../entities/types";

export class CompanyService {
  private  static serviceManager: Repository<Service>
    = AppDataSource.getRepository(Service);

  static async findServiceByName(name: string): Promise<Service | null> {
    return this.serviceManager.createQueryBuilder("t_service")
      .where("LOWER(t_service.name) = LOWER(:name)", { name })
      .getOne();
  }

  static async findServiceById(id: string): Promise<Service | null> {
    return this.serviceManager.findOneBy({
      id
    });
  }

  static async create(service: ServiceDTO): Promise<Service | null> {
    return this.serviceManager.save(service);
  }
  
  static async findAll({
    withRelation,
    isAdmin
  }: { withRelation: boolean, isAdmin: boolean }
  ): Promise<Service[]> {
    return this.serviceManager.find({
      select: ["id", "description", "name", "createdAt", "isActive"],
      where: isAdmin ? undefined : { isActive: !isAdmin },
      relations: {
        posts: withRelation
      }
    });
  }

  static async toggle(service: Service): Promise<void> {
    await this.serviceManager.update({
      id: service.id
    }, service);
  }

  static async findServiceByPostId(id: string): Promise<Service | null> {
    return this.serviceManager.findOneBy({
      posts: {
        id
      }
    });
  }

  static async update(service: Service): Promise<void> {
    this.serviceManager.update({
      id: service.id
    }, service);
  }
}
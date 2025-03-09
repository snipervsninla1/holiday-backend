import { AppDataSource } from "../data-source";
import { Employee } from "../entities/Employee";
import { FindOptionsSelect, Repository } from "typeorm";

export class PersonService {
  private static personManager: Repository<Employee> =
    AppDataSource.getRepository(Employee);

  private static extractFields: (keyof Employee) [] = [
    "id",
    "email",
    "lastName",
    "firstname",
    "createdAt"
  ];

  static async findByEmail(
    email: string,
    withRole = true): Promise<Employee | null> {
    return this.personManager.findOne({
      where: {
        email: email.toLowerCase()
      },
      relations: {
        roles: withRole
      },
      loadEagerRelations: true
    });
  }

  static async findByLastName(lastName: string): Promise<Employee | null> {
    return this.personManager
      .createQueryBuilder("t_employee")
      .where("LOWER(t_employee.lastName) = LOWER(:lastName)", { lastName })
      .getOne();
  }

  static async findUserById(userId: string): Promise<Employee | null> {
    return this.personManager.findOne({
      select: [...this.extractFields, "holidays", "posts", "roles"],
      where: {
        id: userId
      },
      relations: {
        holidays: true,
        posts: true,
        roles: true
      }
    });
  }

  static async create(person: Employee): Promise<Employee | null> {
    return this.personManager.save(person);
  }

  static async findAll(): Promise<Employee[]> {
    return this.personManager.find({
      select: this.extractFields as FindOptionsSelect<Employee>,
      relations: {
        roles: true,
        posts: true
      }
    });
  }

  static async update(employee: Employee): Promise<void> {
    this.personManager.update({
      id: employee.id
    }, employee);
  }
}
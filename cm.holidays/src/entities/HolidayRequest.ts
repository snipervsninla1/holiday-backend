import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";
import { HolidayRequestDTO, HolidayTypeDTO, HolidayStatusDTO  } from "./types";
import { HolidayType } from "./HolidayType";
import dayjs from "dayjs";

@Entity({
  name: "t_holidayRequest"
})
export class HolidayRequest implements HolidayRequestDTO {
    @PrimaryGeneratedColumn("uuid")
    @Column({
      primary: true,
      type: "uuid",
      nullable: false,
      unique: true
    })
  declare id: string;

    @Column({
      type: "date",
      nullable: false
    })
    declare startingDate: string;

    @Column({
      type: "date",
      nullable: false
    })
    declare endingDate: string;

    @Column({
      type: "date",
      nullable: false
    })
    declare returningDate: string;

    @Column({
      type: "varchar",
      nullable: false
    })
    declare description: string;

    @ManyToOne(() => Employee, (employee) => employee.holidays)
    declare employee: Employee;

    @Column({
      type: "varchar",
      nullable: false,
      default: "DRAFT"
    })
    declare status: HolidayStatusDTO;

    @ManyToOne(() => HolidayType, (holiday) => holiday.holidaysRequests)
    declare type: HolidayTypeDTO;

  @CreateDateColumn({ 
    name: "createdAt",
    default: dayjs().toISOString()
  })
    declare createdAt?: string;
}
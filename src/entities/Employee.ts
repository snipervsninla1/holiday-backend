import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, ManyToMany,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { Auth } from "../utils/auth";
import { EmployeeDTO, EmployeeDTOForCreation } from "./types";
import { HolidayRequest } from "./HolidayRequest";
import { Setting } from "./Setting";
import { Role } from "./Role";
import { Post } from "./Post";

type EmployeeType = EmployeeDTO & EmployeeDTOForCreation;
@Entity({
  name: "t_employee"
})
export class Employee implements EmployeeType {
    @PrimaryGeneratedColumn("uuid")
    @Column({
      primary: true,
      type: "uuid",
      nullable: false,
      unique: true
    })
  declare id: string;

    @Column({
      type: "varchar",
      nullable: false
    })
    declare firstname: string;

    @Column({
      nullable: false,
      type: "varchar",
      unique: true
    })
    declare lastName: string;

    @Column({
      nullable: false,
      type: "text",
      unique: true
    })
    declare password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hasPasswordAtCreation(): Promise<void> {
      if (this.password) this.password = await Auth.makeHash(this.password);
    }

    @Column({
      nullable: false,
      type: "varchar",
      unique: true
    })
    declare email: string;

    @CreateDateColumn({ name: "created_at" })
    declare createdAt?: string;

    @UpdateDateColumn({ name: "updated_at" })
    declare updatedAt?: string;

    @ManyToMany(() => Role, (role) => role.employees,{
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      cascade: true
    })
    declare roles: Role[];

    @OneToMany(
      () => HolidayRequest,
      (holidayRequest) => holidayRequest.employee,{
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true
      })
    declare holidays: HolidayRequest[];

    @ManyToMany(() => Post, (post) => post.employee,{
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })
    declare posts: Post[];

    @OneToOne(() => Setting)
    @JoinColumn()
    declare setting: Setting;
}
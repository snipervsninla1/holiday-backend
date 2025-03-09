import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleDTO, USER_ROLE } from "./types";
import { Employee } from "./Employee";
import { JoinTable } from "typeorm";

@Entity({
  name: "t_role"
})
export class Role implements RoleDTO {
    @PrimaryGeneratedColumn("uuid")
    @Column({
      primary: true,
      type: "uuid",
      nullable: false,
      unique: true
    })
  declare id: string;

    @Column({
      type: "enum",
      enum: USER_ROLE,
      nullable: false,
      unique: true
    })
    declare type: USER_ROLE;

    @Column({
      type: "varchar",
      nullable: true
    })
    declare description?: string;

    @ManyToMany(() => Employee, employee => employee.roles,{
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })
    @JoinTable()
    @JoinColumn({ name: "employeeId" })
    declare employees: Employee[];
}
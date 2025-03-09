import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { PostDTO } from "./types";
import { Service } from "./Service";
import { Employee } from "./Employee";

@Entity({
  name: "t_post"
})
export class Post implements PostDTO {
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
    declare name: string;

    @Column({
      type: "varchar",
      nullable: true
    })
    declare description?: string;

    @Column({ type: "boolean",
      nullable: false })
    declare isActive: boolean;

    @CreateDateColumn({ name: "created_at" })
    declare createdAt?: string;

    @UpdateDateColumn({ name: "updated_at" })
    declare updatedAt?: string;

    @ManyToOne(() => Service, (service) => service.posts)
    declare service: Service;

    @ManyToMany(() => Employee, (employee) => employee.posts, {
      cascade: true
    })
    @JoinColumn({ name: "employeeId" })
    @JoinTable()
    declare employee: Employee[];
}
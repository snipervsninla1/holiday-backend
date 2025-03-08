import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServiceDTO } from "./types";
import { Post } from "./Post";

@Entity({
  name: "t_service"
})
export class Service implements ServiceDTO {
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
      nullable: false,
      unique: true
    })
    declare name: string;

    @Column({
      type: "varchar",
      nullable: true
    })
    declare description?: string;

    @Column({
      type: "boolean",
      nullable: false
    })
    declare isActive: boolean;

    @CreateDateColumn({ name: "created_at" })
    declare createdAt?: string;

    @UpdateDateColumn({ name: "updated_at" })
    declare updatedAt?: string;

    @OneToMany(() => Post, (post) => post.service)
    declare posts: Post[];
}
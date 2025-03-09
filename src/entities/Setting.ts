import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SettingDTO } from "./types";

@Entity({
  name: "t_setting"
})
export class Setting implements SettingDTO {
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
    declare defaultEmailNotification: string;

    @Column({
      type: "varchar",
      nullable: true,
      unique: true
    })
    declare customEmailNotification: string;
}
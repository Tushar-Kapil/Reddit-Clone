import { PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from "typeorm";
import { Exclude, classToPlain } from "class-transformer";

export default abstract class Helper extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  toJSON() {
    return classToPlain(this);
  }
}

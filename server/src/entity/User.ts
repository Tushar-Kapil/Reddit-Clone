import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { Exclude } from "class-transformer";

import Helper from "./Helper";
import { Post } from "./Post";
import bcrypt from "bcrypt";
import { Vote } from "./Vote";

@Entity("users")
export class User extends Helper {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @Index()
  @IsEmail(undefined, { message: "Must be a valid email address" })
  @Column({
    unique: true,
  })
  email: string;

  @Index()
  @Length(3, undefined, {
    message: "Username must be at least 3 characters long.",
  })
  @Column({
    unique: true,
  })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Must be at least 6 characters long" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

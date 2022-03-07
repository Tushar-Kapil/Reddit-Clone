import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import Helper from "./Helper";
import { Post } from "./Post";

import { User } from "./User";
import Comments from "./Comments";

@Entity("votes")
export class Vote extends Helper {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comments)
  comments: Comments;
}

import { Expose } from "class-transformer";
import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Index,
  OneToMany,
} from "typeorm";
import { makeId } from "../utils/helpers";
import Helper from "./Helper";
import { Post } from "./Post";
import { User } from "./User";
import { Vote } from "./Vote";

@Entity("comments")
export default class Comments extends Helper {
  constructor(comments: Partial<Comments>) {
    super();
    Object.assign(this, comments);
  }
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => Vote, (vote) => vote.comments)
  votes: Vote[];

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(8);
  }
}

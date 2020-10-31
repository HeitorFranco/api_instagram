import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

import User from "./User";
import Post from "./Post";
import bcrypt from "bcryptjs";

@Entity("comments")
export default class Comment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: "post_id" })
  post: User;
}

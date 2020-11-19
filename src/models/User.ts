import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

import Post from "./Post";
import Like from "./Like";
import Comment from "./Comment";
import bcrypt from "bcryptjs";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  photo_path: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  @OneToMany(() => Post, (post) => post.user, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "user_id" })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "user_id" })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "user_id" })
  likes: Like[];
}

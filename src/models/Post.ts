import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import Comment from "./Comment";
import Like from "./Like";
import User from "./User";

@Entity("posts")
export default class Post {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  photo_path: string;

  @Column()
  photo_path_compressed: string;

  @Column()
  description: string;

  @Column()
  likes: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "user_id" })
  comments: Comment[];

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "user_id" })
  likess: Like[];
}

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";

import userView from "../views/users_view";
import postView from "../views/posts_view";

export default {
  async create(req: Request, res: Response) {
    const { content, postId } = req.body;
    if (!content || !postId) {
      return res.sendStatus(400);
    }

    const commentRepository = getRepository(Comment);
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);

    const post = await postRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });
    const user = await userRepository.findOne({ where: { id: req.userId } });

    const comment = commentRepository.create({
      content,
      post: post,
      user,
    });
    await commentRepository.save(comment);

    //delete comment.user.password;

    req.io.emit("newComment", comment);
    const data = {
      ...comment,
      ["user"]: userView.render(comment.user),
      ["post"]: postView.render(comment.post),
    };

    return res.json(data);
  },
};

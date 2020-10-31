import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";

export default {
  async create(req: Request, res: Response) {
    const { content, postId } = req.body;
    const commentRepository = getRepository(Comment);
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);

    const post = await postRepository.findOne({ where: { id: postId } });
    const user = await userRepository.findOne({ where: { id: req.userId } });

    const comment = commentRepository.create({
      content,
      post,
      user,
    });
    await commentRepository.save(comment);

    delete comment.user.password;

    return res.json(comment);
  },
};

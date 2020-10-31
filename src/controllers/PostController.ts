import { Request, Response } from "express";

import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Post from "../models/Post";

export default {
  async index(req: Request, res: Response) {
    const postRepository = getRepository(Post);
    const { page, limit } = req.query;

    const pageN = Number(page);
    const limitN = Number(limit);

    const offset = 0 + (pageN - 1) * limitN;

    const posts = await postRepository.findAndCount({
      take: limitN,
      skip: offset,
      relations: ["comments"],
      order: { id: "ASC" },
    });
    {
      length: posts[1];
    }
    const total = posts[1];
    const pages = Math.ceil(total / limitN);

    return res.json({
      posts: [...posts[0]],
      total,
      pages,
      limit: limitN,
      page: pageN,
    });
  },

  async create(req: Request, res: Response) {
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id: req.userId } });

    const post = postRepository.create({
      ...req.body,
      user: user,
    });

    delete post.user.password;

    await postRepository.save(post);

    return res.json(post);
  },
};

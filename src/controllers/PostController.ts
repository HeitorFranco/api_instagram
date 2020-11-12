import { Request, Response } from "express";

import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Post from "../models/Post";
import userView from "../views/users_view";

import postView from "../views/posts_view";

export default {
  async index(req: Request, res: Response) {
    const postRepository = getRepository(Post);
    const { page = 1, limit = 0 } = req.query;

    const pageN = Number(page);
    const limitN = Number(limit);

    const offset = 0 + (pageN - 1) * limitN;

    const posts = await postRepository.findAndCount({
      take: limitN,
      skip: offset,
      relations: ["user", "comments"],
      order: { id: "ASC" },
    });
    {
      length: posts[1];
    }
    const total = posts[1];
    const pages = Math.ceil(total / limitN);

    const dataUser = posts[0].map((post) => {
      return userView.render(post.user);
    });

    return res.json({
      posts: postView.renderMany(posts[0]),
      total,
      pages: pages ? pages : undefined,
      limit: limit ? limitN : undefined,
      page: pageN ? pageN : undefined,
    });
  },
  async show(req: Request, res: Response) {
    const postRepository = getRepository(Post);
    const { id } = req.params;

    const post = await postRepository.findOneOrFail({
      where: { id },
      relations: ["comments", "user"],
    });

    return res.json(postView.render(post));
  },

  async create(req: Request, res: Response) {
    const { description, likes } = req.body;

    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id: req.userId } });

    const requestImages = req.file;
    const photo_path = requestImages.filename;

    const post = postRepository.create({
      description,
      likes,
      photo_path,
      user: user,
    });

    //delete post.user.password;
    await postRepository.save(post);
    //delete post.photo_path;

    return res.json({
      post: postView.render(post),
    });
  },
};

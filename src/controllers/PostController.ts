import { Request, Response } from "express";

import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Like from "../models/Like";
import Post from "../models/Post";

import userView from "../views/users_view";
import postView from "../views/posts_view";
import likeView from "../views/likes_view";

import IPost from "../interfaces/Post";
import compressImage from "../utils/compressImage";

export default {
  async index(req: Request, res: Response) {
    const postRepository = getRepository(Post);
    const likeRepository = getRepository(Like);
    const { page = 1, limit = 0 } = req.query;

    const pageN = Number(page);
    const limitN = Number(limit);

    const offset = 0 + (pageN - 1) * limitN;

    const posts = await postRepository.findAndCount({
      take: limitN,
      skip: offset,
      relations: ["user", "comments"],
      order: { id: "DESC" },
    });
    const total = posts[1];
    const pages = Math.ceil(total / limitN);

    const dataUser = posts[0].map((post) => {
      return userView.render(post.user);
    });

    let data: any = [];

    const likes = likeView.renderMany(
      await likeRepository.find({ relations: ["post", "user"] })
    );
    if (likes.length) {
      posts[0].forEach((post) => {
        data.push(postView.render({ ...post, myLike: false }));
        likes.forEach((like, index) => {
          if (like.post.id === post.id && like.user.id === +req.userId) {
            data[data.length - 1] = postView.render({ ...post, myLike: true });
          }
        });
      });
    } else {
      data = postView.renderMany(posts[0]);
    }

    return res.json({
      posts: data,
      total,
      pages: pages ? pages : undefined,
      limit: limit ? limitN : undefined,
      page: pageN ? pageN : undefined,
    });
  },

  async show(req: Request, res: Response) {
    const postRepository = getRepository(Post);
    const likeRepository = getRepository(Like);
    const { id } = req.params;

    const post = await postRepository.findOneOrFail({
      where: { id },
      relations: ["comments", "user"],
    });
    return res.json(postView.render(post));
  },

  async create(req: Request, res: Response) {
    const { description } = req.body;

    if (!description) {
      return res.sendStatus(400);
    }

    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id: req.userId } });

    const requestImages = req.file;

    if (!requestImages) {
      return res.sendStatus(400);
    }

    const [photo_path, photo_path_compressed] = await compressImage(
      requestImages,
      700,
      100
    );

    const post = postRepository.create({
      description,
      photo_path,
      photo_path_compressed,
      likes: 0,
      user: user,
    });

    //delete post.user.password;
    await postRepository.save(post);
    //delete post.photo_path;
    req.io.emit("newPost", postView.render(post));

    return res.json({
      post: postView.render(post),
    });
  },
};

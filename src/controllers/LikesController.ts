import { Request, Response } from "express";
import { getRepository } from "typeorm";

import Like from "../models/Like";
import Post from "../models/Post";
import User from "../models/User";

import likeView from "../views/likes_view";
import postView from "../views/posts_view";

export default {
  async create(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const postRepository = getRepository(Post);
    const likeRepository = getRepository(Like);
    const { postId } = req.body;
    if (!postId) res.sendStatus(400);
    const user = await userRepository.findOneOrFail({
      where: { id: req.userId },
    });
    const post = await postRepository.findOneOrFail({
      where: { id: postId },
    });

    const myLike = await likeRepository.findOne({
      where: { user: req.userId, post: postId },
    });
    if (myLike) {
      deslike();
    } else {
      like();
    }
    async function like() {
      await postRepository.update(post, { likes: post.likes + 1 });
      const newPost = await postRepository.findOneOrFail({
        where: { id: postId },
        relations: ["comments", "user"],
      });

      let likes = likeRepository.create({ post: newPost, user });

      await likeRepository.save(likes);

      req.io.emit("newLike", {
        ...postView.render(newPost),
        myLikeId: req.userId,
      });

      return res.json({ ...likeView.render(likes), ["myLike"]: true });
    }

    async function deslike() {
      await likeRepository.remove(myLike!);
      await postRepository.update(post, { likes: post.likes - 1 });
      const newPost = await postRepository.findOneOrFail({
        where: { id: postId },
        relations: ["comments", "user"],
      });

      let likes = likeRepository.create({ post: newPost, user });

      req.io.emit("deleteLike", postView.render(newPost));
      return res.json({ ...likeView.render(likes), ["myLike"]: false });
    }
  },
};

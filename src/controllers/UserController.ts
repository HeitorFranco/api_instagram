import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import User from "../models/User";

import userView from "../views/users_view";

export default {
  async index(req: Request, res: Response) {
    const repository = getRepository(User);
    const user = await repository.findOne({
      where: { id: req.userId },
      relations: ["posts"],
    });
    if (!user) return res.status(401).json({ erro: "Usuário não encontrado" });

    return res.json(userView.render(user));
  },
  async create(req: Request, res: Response) {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.sendStatus(400);
    }
    const repository = getRepository(User);

    /*const requestImages = req.file;
    const photo_path = requestImages.filename;*/

    if (
      (await repository.findOne({ where: { email } })) ||
      (await repository.findOne({ where: { username } }))
    )
      return res.status(409).json({ erro: "Usuário já cadastrado no sistema" });

    const user = repository.create({
      username,
      name,
      email,
      password,
      photo_path: "user.png",
    });
    await repository.save(user);

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });
    //delete user.password;

    return res.json({ user: userView.render(user), token });
  },
};

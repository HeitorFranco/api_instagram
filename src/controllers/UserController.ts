import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import User from "../models/User";

import userView from "../views/users_view";

export default {
  async index(req: Request, res: Response) {
    const repository = getRepository(User);
    const user = await repository.findOneOrFail({
      where: { id: req.userId },
      relations: ["posts"],
    });

    return res.json(userView.render(user));
  },
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const repository = getRepository(User);

    const requestImages = req.file;
    const photo_path = requestImages.filename;

    if (await repository.findOne({ where: { email } }))
      return res.status(409).send("Usuário já cadastrado no sistema");

    const user = repository.create({ name, email, password, photo_path });
    console.log(user);
    await repository.save(user);

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });
    delete user.password;

    return res.json({ user, token });
  },
};

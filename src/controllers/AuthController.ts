import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import userView from "../views/users_view";

export default {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await repository.findOne({ where: { email } });
    if (!user) return res.status(401).json({ erro: "Usuário não encontrado" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ erro: "Senha incorreta" });

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });

    //delete user.password;

    return res.json({ user: userView.render(user), token });
  },
};

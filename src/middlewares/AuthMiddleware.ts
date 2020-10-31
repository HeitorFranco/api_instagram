import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface tokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  if (!authorization)
    return res
      .sendStatus(401)
      .send({ erro: "Token de autenticação não encontrado" });

  const token = authorization.replace("Bearer", "").trim();

  try {
    const data = jwt.verify(token, "secret");

    const { id } = data as tokenPayload;

    req.userId = id;
    return next();
  } catch {
    return res.sendStatus(401).send({ erro: "Token inválido" });
  }
}

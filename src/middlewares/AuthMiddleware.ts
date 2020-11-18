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
  if (!authorization) {
    return res
      .status(401)
      .json({ erro: "Token de autenticação não encontrado" });
  }

  try {
    const token = authorization.replace("Bearer", "").trim();
    const data = jwt.verify(token, "secret");

    const { id } = data as tokenPayload;
    req.userId = id;
    return next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

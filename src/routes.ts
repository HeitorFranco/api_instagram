import { Router } from "express";

import AuthController from "./controllers/AuthController";

import UserController from "./controllers/UserController";
import CommentController from "./controllers/CommentController";
import PostController from "./controllers/PostController";
import authMiddleware from "./middlewares/AuthMiddleware";

const routes = Router();

routes.post("/auth", AuthController.authenticate);
routes.post("/users", UserController.create);
routes.get("/posts", PostController.index);

routes.use(authMiddleware);
//Rotas que usam authMiddleware

routes.post("/comments", CommentController.create);
routes.get("/users", UserController.index);
routes.post("/posts", PostController.create);

export default routes;

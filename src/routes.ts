import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload";

import AuthController from "./controllers/AuthController";

import UserController from "./controllers/UserController";
import CommentController from "./controllers/CommentController";
import PostController from "./controllers/PostController";
import LikesController from "./controllers/LikesController";
import authMiddleware from "./middlewares/AuthMiddleware";

const upload = multer(uploadConfig);

const routes = Router();

routes.post("/auth", AuthController.authenticate);
routes.post("/users", /*upload.single("image"),*/ UserController.create);

routes.use(authMiddleware);
//Rotas que usam authMiddleware

routes.get("/users", UserController.index);

routes.get("/posts", PostController.index);
routes.post("/posts", upload.single("image"), PostController.create);
routes.get("/posts/:id", PostController.show);

routes.post("/comments", CommentController.create);

routes.post("/likes", LikesController.create);

export default routes;

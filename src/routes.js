import { Router } from "express";
import ProductController from "./app/controllers/ProductController";
import SessionController from "./app/controllers/SessionController";
import UserController from "./app/controllers/UserController";
import multer from "multer";
import multerConfig from "./config/multer";
import authMiddleware from "../src/app/middlewares/auth";
import CategoryController from "./app/controllers/CategoryController";
import OrderController from "./app/controllers/OrderController";
const routes = new Router();

const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post("/products", upload.single("file"), ProductController.store);
routes.get("/products", ProductController.index);

routes.post("/categories", CategoryController.store);
routes.get("/categories", CategoryController.index);
routes.post("/orders", OrderController.store);

export default routes;

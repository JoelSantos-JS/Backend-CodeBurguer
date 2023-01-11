import { Router } from "express";
import { v4 } from "uuid";

import User from "./app/models/User";
import "./database";

const routes = new Router();

routes.get("/", async (req, res) => {
  const user = await User.create({
    id: v4(),
    name: "Joel Santos",
    email: "joeltere8@gmail.com",
    password_hash: "joel123",
    admin: true,
  });
  return res.json(user);
});

export default routes;

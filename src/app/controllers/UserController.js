// store => Cadastrar / Adicionar

// index => Listar Varios
// show  => List apenas um
// update  => Atualizar
// delete => deletar

import { v4 } from "uuid";
import User from "../models/User";
import * as Yup from "yup";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(5),
      admin: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: "Tenha certerza que os seu dados estao corretos " });
    }

    const { name, email, password, admin } = req.body;

    const userAlreadyExist = await User.findOne({
      where: { email },
    });

    if (userAlreadyExist) {
      return res.status(409).json({ error: "email already exists" });
    }

    const user = await User.create({
      id: v4(),
      name: name,
      email: email,
      password: password,
      admin: admin,
    });

    return res.status(201).json(user);
  }
}

export default new UserController();

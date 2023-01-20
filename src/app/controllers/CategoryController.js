import * as Yup from "yup";
import Category from "../models/Categories";
import Product from "../models/Product";
import User from "../models/User";

class CategoryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: "Make sure your name  are correct" });
    }

    const { admin: isAdmin } = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res.status(401).json();
    }

    const { name } = req.body;
    const { filename: path } = req.file;
    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExists) {
      return res.status(400).json({ error: "Category already exists" });
    }
    const { id } = await Category.create({
      name,
      path,
    });

    return res.json({ name, id });
  }

  async index(req, res) {
    const categories = await Category.findAll();

    return res.json(categories);
  }
}

export default new CategoryController();

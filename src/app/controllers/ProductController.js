import * as Yup from "yup";
import Product from "../models/Product";

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: "Make sure your name or email or price are correct" });
    }

    const { filename: path } = req.file;
    const { name, price, category } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      path,
    });

    return res.json(product);
  }

  async index(req, res) {
    const products = await Product.findAll();

    return res.json(products);
  }
}

export default new ProductController();

// store => Cadastrar / Adicionar

// index => Listar Varios
// show  => List apenas um
// update  => Atualizar
// delete => deletar

import { v4 } from "uuid";
import User from "../models/User";
import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Categories";
import Order from "../schemas/Order";

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: "Tenha certerza que os seu dados estao corretos " });
    }

    const productsId = req.body.products.map((product) => product.id);

    const updatedProducts = await Product.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });

    const editedProducts = updatedProducts.map((product) => {
      const productIndex = req.body.products.findIndex(
        (requestProduct) => requestProduct.id === product.id
      );

      console.log(productIndex);

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: req.body.products[productIndex].quantity,
      };

      return newProduct;
    });

    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
      products: editedProducts,
      status: "Pedido realizado",
    };

    const orderResponse = await Order.create(order);

    return res.status(201).json(orderResponse);
  }

  async index(req, res) {
    const orders = await Order.find();

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: "Tenha certerza que os seu dados estao corretos " });
    }

    const { admin: isAdmin } = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res.status(401).json();
    }

    const { id } = req.params;
    const { status } = req.body;
    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: "Status updated" });
  }
}

export default new OrderController();

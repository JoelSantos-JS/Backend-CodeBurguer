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
        quantity: req.body.product[productIndex].quantity,
      };

      return newProduct;
    });

    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
    };

    return res.status(201).json(editedProducts);
  }
}

export default new OrderController();

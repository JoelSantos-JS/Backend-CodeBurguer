import * as Yup from "yup";
import jwt from "jsonwebtoken";
import User from "../models/User";
import authConfig from "../../config/auth";

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: "Make sure your password or email are correct" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Make sure your password or email are correct" });
    }

    if (!(await user.checkPassword(password))) {
      return res
        .status(401)
        .json({ error: "Make sure your password or email are correct" });
    }

    return res.json({
      id: user.id,
      email,
      name: user.email,
      admin: user.admin,
      token: jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";

export default (req, res, next) => {
  const authTOken = req.headers.authorization;
  if (!authTOken) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authTOken.split(" ")[1];

  try {
    jwt.verify(token, authConfig.secret, function (err, decode) {
      if (err) {
        throw new Error();
      }

      req.userId = decode.id;
      req.userName = decode.name;

      return next();
      //
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "token is invalid" });
  }
};

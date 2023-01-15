import Sequelize from "sequelize";
import ConfigData from "../config/database";
import User from "../app/models/User";
import Product from "../app/models/Product";
import Category from "../app/models/Categories";

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(ConfigData);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();

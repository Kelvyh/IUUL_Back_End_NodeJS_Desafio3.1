import { Sequelize } from "sequelize";
//alterar de acordo com o seu banco de dados
const sequelize = new Sequelize(
  "consultorio_odontologico",
  "postgres",
  "postgres",
  {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    logging: false,
  }
);

export { sequelize };
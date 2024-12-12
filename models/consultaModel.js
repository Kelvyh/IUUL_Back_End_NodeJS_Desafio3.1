import { Sequelize } from "sequelize";
import { sequelize } from "../db.js";

const Consulta = sequelize.define('consultas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    horaInicio: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    horaFim: {
        type: Sequelize.TIME,
        allowNull: false,
    }
});

export { Consulta }
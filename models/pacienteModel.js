import { Sequelize } from "sequelize";
import { sequelize } from "../db.js";

const Paciente = sequelize.define('pacientes', {
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dataNascimento: {
        type: Sequelize.DATEONLY,
        allowNull: false
    }
});

export { Paciente };
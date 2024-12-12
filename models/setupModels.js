import { Paciente } from "./pacienteModel.js";
import { Consulta } from "./consultaModel.js";

const setupModels = () => {
    Paciente.hasMany(Consulta, { foreignKey: 'cpfPaciente'});
    Consulta.belongsTo(Paciente, { foreignKey: 'cpfPaciente', allowNull: false });
}

export { setupModels };
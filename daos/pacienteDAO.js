import { Paciente } from "../models/pacienteModel.js";

class pacienteDAO {
    async addPaciente(pacienteData) {
        let [dia, mes, ano] = pacienteData.dataNascimento.split('/').map(part => parseInt(part));
        let dataNascimento = new Date(ano, mes-1, dia);
        try {
            const paciente = await Paciente.create({cpf: pacienteData.cpf, nome: pacienteData.nome, dataNascimento: dataNascimento});
            return paciente;
        } catch (error) {
            console.error("Não foi possível cadastrar o paciente:", error);
        }
    }

    async excluirPaciente(cpf) {
        const paciente = await Paciente.destroy({ where: { cpf } });
        return paciente;
    }

    async getPacienteByCpf(cpf) {
        return await Paciente.findOne({ where: { cpf } });
    }

    async listar(ordem, direcao) {
        return await Paciente.findAll({
            order: [[ordem, direcao]],
            raw: true
        });
    }
};

export { pacienteDAO };
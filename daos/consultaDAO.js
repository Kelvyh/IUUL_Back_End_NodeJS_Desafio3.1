import { Consulta } from "../models/consultaModel.js";
import { Paciente } from "../models/pacienteModel.js";
import { Op } from 'sequelize';

class consultaDAO {
    async addConsulta(consultaData) {
        let [dia, mes, ano] = consultaData.data.split('/').map(part => parseInt(part));
        let data = new Date(ano, mes-1, dia);
        try {
            const consulta = await Consulta.create({data: data, horaInicio: consultaData.horaInicio, horaFim: consultaData.horaFim, cpfPaciente: consultaData.paciente.cpf});
            return consulta;
        } catch (error) {
            console.error("Não foi possível cadastrar a consulta:", error);
        }
    }

    async listarConsultasPorPeriodo(dataInicio, dataFim) {
        let [diaInicio, mesInicio, anoInicio] = dataInicio.split('/').map(part => parseInt(part));
        let dataInicioFormatada = new Date(anoInicio, mesInicio-1, diaInicio);
        let [diaFim, mesFim, anoFim] = dataFim.split('/').map(part => parseInt(part));
        let dataFimFormatada = new Date(anoFim, mesFim-1, diaFim);
        
        return await Consulta.findAll({
            where: {
                data: {
                    [Op.between]: [dataInicioFormatada, dataFimFormatada]
                }
            },
            include: [
                {
                    model: Paciente,
                    attributes: ['nome', 'dataNascimento']
                }
            ],
            order: [['data', 'ASC']],
            raw: true
        });
    }

    async listar() {
        return await Consulta.findAll({
            order: [['data', 'ASC']],
            include: [
                {
                    model: Paciente,
                    attributes: ['nome', 'dataNascimento']
                }
            ],
            raw: true
        });
    }

    async excluirConsulta(cpf) {
        const consulta = await Consulta.destroy({ where: { cpfPaciente: cpf } });
        return consulta;
    }

    async cancelarAgendamento(cpf, dataConsulta, horaInicio) {
        let [dia, mes, ano] = dataConsulta.split('/').map(part => parseInt(part));
        let data = new Date(ano, mes-1, dia);
        const consulta = await Consulta.destroy({ where: { cpfPaciente: cpf, data: data, horaInicio: horaInicio } });
        return consulta;
    }

    async getConsultaByCpf(cpf) {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0];
        return await Consulta.findOne({
            where: {
                cpfPaciente: cpf,
                [Op.or]: [
                    {
                      data: {
                        [Op.gt]: now,
                      },
                    },
                    {
                      data: now,
                      horaInicio: {
                        [Op.gt]: currentTime,
                      },
                    },
                  ],
            }
        });
    }
};

export { consultaDAO };
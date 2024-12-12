import { Consulta } from "./consulta.js"
import { consultaDAO } from "./daos/consultaDAO.js"

import { DateTime } from 'luxon'

class Agenda {
    #consultas = []
    #consultaDAO = new consultaDAO()

    async agendarConsulta(paciente, dataConsulta, horaInicio, horaFim) {
        const consulta = new Consulta(paciente, dataConsulta, horaInicio, horaFim)
        await this.#consultaDAO.addConsulta(consulta)
    }

    async getConsultas() {
        return await this.#consultaDAO.listar()
    }

    async getConsultasPorPeriodo(dataInicio, dataFim) {
        return await this.#consultaDAO.listarConsultasPorPeriodo(dataInicio, dataFim)
    }

    getSobreposicaoDeAgendamento(dataConsulta, horaInicio, horaFim) {
        let horaInicioFormatada = DateTime.fromFormat(horaInicio, 'HHmm').toFormat('HH:mm')
        let horaFimFormatada = DateTime.fromFormat(horaFim, 'HHmm').toFormat('HH:mm')
        return this.#consultas.filter(consulta => 
            consulta.data == dataConsulta && 
            !(horaFimFormatada <= DateTime.fromFormat(consulta.horaInicio, 'HHmm').toFormat('HH:mm') || 
            horaInicioFormatada >= DateTime.fromFormat(consulta.horaFim, 'HHmm').toFormat('HH:mm'))
        );
    }

    async getConsultaFuturaDoPacientePorCpf(cpf) {
        const consulta = await this.#consultaDAO.getConsultaByCpf(cpf);
        return consulta;
    }

    async excluirAgendamentosPorCpf(cpf) {
        await this.#consultaDAO.excluirConsulta(cpf);
    }

    async cancelarAgendamento(cpf, dataConsulta, horaInicio) {
        const consulta = await this.#consultaDAO.cancelarAgendamento(cpf, dataConsulta, horaInicio);
        if(consulta == 0) {
            throw new Error('Erro: consulta não encontrada');
        }
    }

    toString() {
        return this.#consultas.map(consulta => consulta.toString()).join('\n')
    }
}

export {Agenda}
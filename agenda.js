import { Paciente } from "./paciente.js"
import { Consulta } from "./consulta.js"

import { DateTime } from 'luxon'

class Agenda {
    #consultas = []

    agendarConsulta(paciente, dataConsulta, horaInicio, horaFim) {
        let consulta = new Consulta(paciente, dataConsulta, horaInicio, horaFim)
        this.#consultas.push(consulta)
    }

    get consultas() {
        return this.#consultas
    }

    getConsultasPorPeriodo(dataInicio, dataFim) {
        return this.#consultas.filter(consulta => 
            DateTime.fromFormat(consulta.data, 'dd/MM/yyyy') >= DateTime.fromFormat(dataInicio, 'dd/MM/yyyy') &&
            DateTime.fromFormat(consulta.data, 'dd/MM/yyyy') <= DateTime.fromFormat(dataFim, 'dd/MM/yyyy')
        ).sort((consulta1, consulta2) => consulta1.data.localeCompare(consulta2.data));
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

    getConsultaFuturaDoPacientePorCpf(cpf) {
        return this.#consultas.filter(consulta => 
            consulta.paciente.cpf === cpf && 
            (DateTime.fromFormat(consulta.data, 'dd/MM/yyyy') > DateTime.now() ||
            DateTime.fromFormat(consulta.horaInicio, 'HHmm') > DateTime.now())
        );
    }

    excluirAgendamentosPorCpf(cpf) {
        this.#consultas = this.#consultas.filter(consulta => consulta.paciente.cpf !== cpf)
    }

    cancelarAgendamento(cpf, dataConsulta, horaInicio) {
        let index = this.#consultas.findIndex(consulta => consulta.paciente.cpf === cpf && consulta.data === dataConsulta && consulta.horaInicio === horaInicio);
        if(index === -1) {
            throw new Error('Erro: consulta não encontrada');
        }
        this.#consultas.splice(index, 1);
        console.log('Consulta cancelada com sucesso!')
    }

    toString() {
        return this.#consultas.map(consulta => consulta.toString()).join('\n')
    }
}

export {Agenda}
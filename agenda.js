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

    getConsultasPorPeriodo(dataConsulta, horaInicio, horaFim) {
        if(horaInicio === null && horaFim === null)
            return this.#consultas.filter(consulta => consulta.data === dataConsulta)

        let horaInicioFormatada = DateTime.fromFormat(horaInicio, 'HHmm').toFormat('HH:mm')
        let horaFimFormatada = DateTime.fromFormat(horaFim, 'HHmm').toFormat('HH:mm')
        console.log(dataConsulta, horaInicioFormatada, horaFimFormatada)

        console.log(this.#consultas.filter(
            consulta =>
            DateTime.fromFormat(consulta.horaInicio, 'HHmm').toFormat('HH:mm') <= horaInicioFormatada && 
            DateTime.fromFormat(consulta.consulta.horaFim, 'HHmm').toFormat('HH:mm') <= horaFimFormatada
        ))
        return this.#consultas.filter(consulta => consulta.data === dataConsulta && consulta.horaInicio >= horaInicio && consulta.horaFim <= horaFim);
    }

    toString() {
        console.log(this.#consultas.map(consulta => consulta.toString()).join('\n'))
        // return this.#consultas.map(consulta => consulta.toString()).join('\n')
    }
}

export {Agenda}
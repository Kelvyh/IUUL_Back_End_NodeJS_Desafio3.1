import { DateTime } from 'luxon';
import { Agenda } from './agenda.js';

class ConsultaController {
    #agenda = new Agenda();

    get agenda() {
        return this.#agenda;
    }

    agendarConsulta(paciente, dataConsulta, horaInicio, horaFim) {
        this.#agenda.agendarConsulta(paciente, dataConsulta, horaInicio, horaFim);
    }

    listarConsultas() {
        console.log(this.#agenda.consultas.sort((consulta1, consulta2) => consulta1.data.localeCompare(consulta2.data)).map(consulta => consulta.toString()).join('\n'));
    }

    listarConsultasPorPeriodo(dataInicio, dataFim) {
        console.log(this.#agenda.getConsultasPorPeriodo(dataInicio, dataFim).map(consulta => consulta.toString()).join('\n'));
    }

    checarAgendamentosFuturosPorPaciente(paciente) {
        let consultasFuturas = this.#agenda.consultas.filter(consulta => consulta.paciente === paciente && DateTime.fromFormat(consulta.data, 'dd/MM/yyyy') > DateTime.now());
        if (consultasFuturas.length > 0) {
            throw new Error('Erro: paciente com agendamento futuro');
        }
    }

    validarData(dataConsulta) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataConsulta))
            throw new Error('Erro: data de consulta precisa estar no formato DD/MM/AAAA');

        let [dia, mes, ano] = dataConsulta.split('/').map(part => parseInt(part));
        let dataConsultaFormatada = DateTime.fromJSDate(new Date(ano, mes - 1, dia));
        if (dataConsultaFormatada.diffNow('days').as('days') <= -1) {
            throw new Error('Erro: a data da consulta não pode ser no passado');
        }
    }

    validarHorario(horaInicio, horaFim, dataConsulta) {
        //testa o formato HHMM
        if (!/^\d{4}$/.test(horaInicio) || !/^\d{4}$/.test(horaFim))
            throw new Error('Erro: horário da consulta precisa estar no formato HHMM');

        let horaInicioFormatada = DateTime.fromFormat(horaInicio, 'HHmm')
        let horaFimFormatada = DateTime.fromFormat(horaFim, 'HHmm')

        //testa se foi inserido um horário válido
        if (!horaInicioFormatada.isValid || !horaFimFormatada.isValid) {
            throw new Error('Erro: horário inválido! 00h00min até 23h59min');
        }

        //restrição de horário comercial
        const inicioHorarioComercial = DateTime.fromFormat('08:00', 'HH:mm').toFormat('HH:mm');
        const FimHorarioComercial = DateTime.fromFormat('18:00', 'HH:mm').toFormat('HH:mm'); 

        horaInicioFormatada = horaInicioFormatada.toFormat('HH:mm');
        horaFimFormatada = horaFimFormatada.toFormat('HH:mm');
        //testa se o horário de início é antes do horário de fim e se está dentro do horário comercial
        if(horaInicioFormatada >= horaFimFormatada) {
            throw new Error('Erro: horário de início da consulta deve ser antes do horário de fim');
        } else if (horaInicioFormatada < inicioHorarioComercial || horaFimFormatada > FimHorarioComercial) {
            throw new Error('Erro: horário da consulta deve ser entre 08:00 e 18:00');
        }

        //caso a data da consulta seja a data atual, testa se o horário de início é antes do horário atual
        if(DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy').toFormat('dd/MM/yyyy') === DateTime.now().toFormat('dd/MM/yyyy')) {
            if(horaInicioFormatada < DateTime.now().toFormat('HH:mm'))
                throw new Error('Erro: horário de início da consulta não pode ser no passado');
        }

        //testa se o horário segue a regra de 15 em 15 minutos do consultório
        if (parseInt(horaInicio.substring(2)) % 15 !== 0 || parseInt(horaFim.substring(2)) % 15 !== 0) {
            throw new Error('Erro: horário da consulta precisa ser múltiplo de 15 minutos');
        }
    }

    checarSobreposicaoDeAgendamento(dataConsulta, horaInicio, horaFim) {
        let consultasFuturas = this.#agenda.getSobreposicaoDeAgendamento(dataConsulta, horaInicio, horaFim)
        if (consultasFuturas.length > 0) {
            throw new Error('Erro: já existe uma consulta agendada nessa data e horário');
        }
    }

    checarConsultaFuturoDoPacientePorCpf(cpf) {
        if(this.#agenda.getConsultaFuturaDoPacientePorCpf(cpf) !== null) {
            throw new Error('Erro: paciente com agendamento futuro');
        }
        // let consultasFuturas = this.#agenda.getConsultaFuturaDoPacientePorCpf(cpf);
        // if (consultasFuturas.length > 0) {
        //     throw new Error('Erro: paciente com agendamento futuro');
        // }
    }

    excluirAgendamentosPassadosPorCpf(cpf) {
        this.#agenda.excluirAgendamentosPorCpf(cpf);
    }

    cancelarAgendamento(cpf, dataConsulta, horaInicio) {
        console.log(DateTime.fromFormat(horaInicio, 'HHmm'))
        console.log(DateTime.now())
        if(DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy').diffNow('days').as('days') <= -1 ||
        ((DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy').diffNow('days').as('days') >-1 && DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy').diffNow('days').as('days') <= 0) && DateTime.fromFormat(horaInicio, 'HHmm') < DateTime.now())) {
            throw new Error('Erro: data da consulta não pode ser no passado');
        }
        this.#agenda.cancelarAgendamento(cpf, dataConsulta, horaInicio);
        console.log('Agendamento cancelado com sucesso!');
    }
}

export {ConsultaController}
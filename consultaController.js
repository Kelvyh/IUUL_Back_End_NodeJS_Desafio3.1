import { DateTime } from 'luxon';
import { Agenda } from './agenda.js';
import Table from 'cli-table';

class ConsultaController {
    #agenda = new Agenda();

    get agenda() {
        return this.#agenda;
    }

    async agendarConsulta(paciente, dataConsulta, horaInicio, horaFim) {
        await this.#agenda.agendarConsulta(paciente, dataConsulta, horaInicio, horaFim);
    }

    async listarConsultas() {
        var table = new Table({
            head: ['Data', 'H.Ini', 'H.Fim', 'Tempo', 'Nome', 'Dt.Nasc.'],
            colWidths: [15, 10, 10, 10, 30, 15],
            borders: false
        });
        
        const consultas = await this.#agenda.getConsultas();

        for (let consulta of consultas) {
            let tempo = DateTime.fromFormat(consulta.horaFim, 'HH:mm:ss').diff(DateTime.fromFormat(consulta.horaInicio, 'HH:mm:ss'), 'minutes').toFormat('hh:mm');
            table.push([DateTime.fromISO(consulta.data).toFormat('dd/MM/yyyy'), consulta.horaInicio.slice(0, 5), consulta.horaFim.slice(0, 5), tempo, consulta['paciente.nome'], DateTime.fromISO(consulta['paciente.dataNascimento']).toFormat('dd/MM/yyyy')]);
        };
        console.log(table.toString());
    }

    async listarConsultasPorPeriodo(dataInicio, dataFim) {
        var table = new Table({
            head: ['Data', 'H.Ini', 'H.Fim', 'Tempo', 'Nome', 'Dt.Nasc.'],
            colWidths: [15, 10, 10, 10, 30, 15],
            borders: false
        });

        const consultas = await this.#agenda.getConsultasPorPeriodo(dataInicio, dataFim);

        for (let consulta of consultas) {
            let tempo = DateTime.fromFormat(consulta.horaFim, 'HH:mm:ss').diff(DateTime.fromFormat(consulta.horaInicio, 'HH:mm:ss'), 'minutes').toFormat('hh:mm');
            table.push([DateTime.fromISO(consulta.data).toFormat('dd/MM/yyyy'), consulta.horaInicio.slice(0, 5), consulta.horaFim.slice(0, 5), tempo, consulta['paciente.nome'], DateTime.fromISO(consulta['paciente.dataNascimento']).toFormat('dd/MM/yyyy')]);
        };
        console.log(table.toString());
    }

    async checarAgendamentosFuturosPorPaciente(paciente) {
        let consultasFuturas = await this.#agenda.getConsultaFuturaDoPacientePorCpf(paciente.cpf);
        if (consultasFuturas != null) {
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

    async checarConsultaFuturoDoPacientePorCpf(cpf) {
        if(await this.#agenda.getConsultaFuturaDoPacientePorCpf(cpf) !== null) {
            throw new Error('Erro: paciente com agendamento futuro');
        }
    }

    async excluirAgendamentosPassadosPorCpf(cpf) {
        await this.#agenda.excluirAgendamentosPorCpf(cpf);
    }

    async cancelarAgendamento(cpf, dataConsulta, horaInicio) {
        if(DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy').diffNow('days').as('days') <= -1 ||
        ((DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy').diffNow('days').as('days') >-1 && DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy').diffNow('days').as('days') <= 0) && DateTime.fromFormat(horaInicio, 'HHmm') < DateTime.now())) {
            throw new Error('Erro: data da consulta não pode ser no passado');
        }
        await this.#agenda.cancelarAgendamento(cpf, dataConsulta, horaInicio);
        console.log('Agendamento cancelado com sucesso!');
    }
}

export {ConsultaController}
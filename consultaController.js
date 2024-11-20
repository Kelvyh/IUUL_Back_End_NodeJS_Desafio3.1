import { DateTime } from 'luxon';
import { Agenda } from './agenda.js';

class ConsultaController {
    #agenda = new Agenda();

    agendarConsulta(paciente, dataConsulta, horaInicio, horaFim) {
        // if(this.#pacienteRepository.getPacienteByCpf(cpf))
        //     throw new Error('Erro: CPF já cadastrado');
        // this.#pacienteRepository.addPaciente(cpf, nome, dataNascimento);
        // console.log("Paciente cadastrado com sucesso!")
        this.#agenda.agendarConsulta(paciente, dataConsulta, horaInicio, horaFim);
    }

    // Método para listar todas as consultas
    listarConsultas() {
        return this.#agenda.toString();
    }

    checarAgendamentosFuturosPorPaciente(paciente) {
        let consultasFuturas = this.#agenda.consultas.filter(consulta => consulta.paciente === paciente && DateTime.fromFormat(consulta.data, 'dd/MM/yyyy') > DateTime.now());
        if (consultasFuturas.length > 0) {
            throw new Error('Erro: paciente com agendamento futuro');
        }
    }

    // Método para buscar uma consulta pelo id
    buscarConsultaPorId(id) {
        return this.consultas.find(consulta => consulta.id === id);
    }

    // Método para deletar uma consulta pelo id
    deletarConsultaPorId(id) {
        this.consultas = this.consultas.filter(consulta => consulta.id !== id);
    }

    // Método para atualizar uma consulta pelo id
    atualizarConsultaPorId(id, consultaAtualizada) {
        this.consultas = this.consultas.map(consulta => {
            if (consulta.id === id) {
                return consultaAtualizada;
            }
            return consulta;
        });
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

    checarAgendamentosFuturosPorDataEHora(dataConsulta = null, horaInicio = null, horaFim = null) {
        // let consultasFuturas = this.#agenda.consultas.filter(consulta => consulta.data === dataConsulta && consulta.horaInicio === horaInicio && consulta.horaFim === horaFim && DateTime.fromFormat(consulta.data, 'dd/MM/yyyy') > DateTime.now());
        let consultasFuturas = this.#agenda.getConsultasPorPeriodo(dataConsulta, horaInicio, horaFim)
        if (consultasFuturas.length > 0) {
            throw new Error('Erro: já existe uma consulta agendada nessa data e horário');
        }
    }
}

export {ConsultaController}
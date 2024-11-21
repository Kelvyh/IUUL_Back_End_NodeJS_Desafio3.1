// import { Agenda } from './agenda';
import { PacienteController } from './pacienteController.js';
import { ConsultaController } from './consultaController.js';

import promptSync from 'prompt-sync';
var prompt = promptSync({ sigint: true });

function main() {
    let pacienteController = new PacienteController();
    let consultaController = new ConsultaController();
    let cpf, nome, dataNascimento, pacientes, dataConsulta, horaInicio, horaFim, paciente;
        

    while (true) {
        console.log('-------------------------------')
        console.log('1 - Cadastro de pacientes')
        console.log('2 - Agenda')
        console.log('3 - Fim')
        console.log('-------------------------------')
        let opcao = prompt('Escolha uma opção: ')

        switch(opcao) {
            case '1':
                console.log('-------------------------------')
                console.log('1 - Cadastrar novo paciente')
                console.log('2 - Excluir paciente')
                console.log('3 - Listar pacientes (ordenado por CPF)')
                console.log('4 - Listar pacientes (ordenado por nome)')
                console.log('5 - Voltar p/ menu principal')
                console.log('-------------------------------')
                opcao = prompt('Escolha uma opção: ')
                switch(opcao) {
                    case '1':
                        while(true) {
                            cpf = prompt('CPF: ')
                            try {
                                pacienteController.validarCpf(cpf)
                                break
                            } catch (e) {
                                console.log(e.message)
                            }
                        }
                        while (true) {
                            try {
                                nome = prompt('Nome: ')
                                pacienteController.validarNome(nome)
                                break
                            } catch (e) {
                                console.log(e.message)
                            }
                        }
                        while (true) {
                            try {
                                dataNascimento = prompt('Data de nascimento (no formato DD/MM/AAAA): ')
                                pacienteController.validarData(dataNascimento)
                                break
                            } catch (e) {
                                console.log(e.message)
                            }
                        }
                        try {
                            pacienteController.cadastrarPaciente(cpf, nome, dataNascimento)
                        } catch (e) {
                            console.log(e.message)
                        }
                        break;
                    case '2':
                        cpf = prompt('CPF: ')
                        try {
                            consultaController.checarConsultaFuturoDoPacientePorCpf(cpf);
                            consultaController.excluirAgendamentosPassadosPorCpf(cpf);
                            pacienteController.excluirPaciente(cpf);
                        } catch (e) {
                            console.log(e.message)
                        }
                        break;
                    case '3':
                        pacientes = pacienteController.listarPacientesPorCpf();
                        pacientes.forEach(paciente => console.log(paciente.toString()));
                        break;
                    case '4':
                        pacientes = pacienteController.listarPacientesPorNome();
                        pacientes.forEach(paciente => console.log(paciente.toString()));
                        break;
                    case '5':
                        break;
                    default:
                        console.log('Opção inválida!')
                }
                break;
            case '2':
                console.log('-------------------------------')
                console.log('1 - Agendar consulta')
                console.log('2 - Cancelar agendamento')
                console.log('3 - Listar agenda')
                console.log('4 - Voltar p/ menu principal')
                console.log('-------------------------------')
                opcao = prompt('Escolha uma opção: ')
                switch(opcao) {
                    case '1':
                        //validar cpf??
                        while(true) {
                            cpf = prompt('CPF: ')
                            paciente = pacienteController.getPacienteByCpf(cpf)
                            if(!paciente) {
                                console.log('Erro: Paciente não cadastrado')
                            } else {
                                try {
                                    consultaController.checarAgendamentosFuturosPorPaciente(paciente);
                                    break;
                                } catch (e) {
                                    console.log(e.message)
                                }
                            }
                        }
                        while(true) {
                            dataConsulta = prompt('Data da consulta (no formato DD/MM/AAAA): ')
                            try {
                                consultaController.validarData(dataConsulta)
                                break;
                            } catch (e) {
                                console.log(e.message)
                            }
                        }
                        while(true) {
                            horaInicio = prompt('Horário de início da consulta (no formato HHMM): ')
                            horaFim = prompt('Horário de fim da consulta (no formato HHMM): ')
                            try {
                                consultaController.validarHorario(horaInicio, horaFim, dataConsulta)
                                consultaController.checarSobreposicaoDeAgendamento(dataConsulta, horaInicio, horaFim)
                                break;
                            } catch (e) {
                                console.log(e.message)
                            }
                        }
                        consultaController.agendarConsulta(paciente, dataConsulta, horaInicio, horaFim);
                        console.log("Agendamento realizado com sucesso!")
                        break;
                    case '2':
                        cpf = prompt('CPF: ')
                        dataConsulta = prompt('Data da consulta (no formato DD/MM/AAAA): ')
                        horaInicio = prompt('Horário de início da consulta (no formato HHMM): ')
                        try {
                            consultaController.cancelarAgendamento(cpf, dataConsulta, horaInicio);
                        } catch (e) {
                            console.log(e.message)
                        }
                        break;
                    case '3':
                        //toUpper
                        let escolha = prompt('Apresentar a agenda T-Toda ou P-Periodo: ').toUpperCase();
                        switch(escolha) {
                            case "T": consultaController.listarConsultas();
                            break;
                        case "P": 
                            let dataInicio = prompt('Data de início (no formato DD/MM/AAAA): ');
                            let dataFim = prompt('Data de fim (no formato DD/MM/AAAA): ');
                            consultaController.listarConsultasPorPeriodo(dataInicio, dataFim);
                            break;
                        default:
                            console.log('Opção inválida!');
                        }
                        break;
                    case '4':
                        pacientes = pacienteController.listarPacientesPorNome();
                        pacientes.forEach(paciente => console.log(paciente.toString()));
                        break;
                    default:
                        console.log('Opção inválida!')
                }
                break;
            case '3':
                console.log('Fechando o programa...')
                process.exit(0);
            default:
                console.log('Opção inválida!')
        }
    }
}

main()
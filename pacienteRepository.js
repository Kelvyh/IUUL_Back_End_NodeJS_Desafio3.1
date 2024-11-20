import { Paciente } from './paciente.js';

class PacienteRepository {
    #pacientes = [];

    constructor() {
        this.#pacientes.push(new Paciente('07200731382', 'Kelvy', '19/04/2002'))
        this.#pacientes.push(new Paciente('03888091322', 'Klaudia', '27/05/1979'))
    }

    addPaciente(cpf, nome, dataNascimento) {
        let paciente = new Paciente(cpf, nome, dataNascimento);
        this.#pacientes.push(paciente);
    }

    excluirPaciente(cpf) {
        let index = this.#pacientes.findIndex(paciente => paciente.cpf === cpf);
        if(index === -1) {
            throw new Error('Erro: paciente não cadastrado');
        }
        this.#pacientes.splice(index, 1);
        console.log('Paciente excluído com sucesso!')
    }

    getPacienteByCpf(cpf) {
        return this.#pacientes.find(paciente => paciente.cpf === cpf);
    }

    getPacientesPorCpf() {
        return this.#pacientes.sort((paciente1, paciente2) => paciente1.cpf.localeCompare(paciente2.cpf));
    }

    getPacientesPorNome() {
        return this.#pacientes.sort((paciente1, paciente2) => paciente1.nome.localeCompare(paciente2.nome));
    }
}

export { PacienteRepository }
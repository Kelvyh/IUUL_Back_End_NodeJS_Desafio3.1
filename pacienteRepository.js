import { Paciente } from './paciente.js';

class PacienteRepository {
    #pacientes = [];

    constructor() {
        this.#pacientes.push(new Paciente('36972742013', 'Fulano de tal 1', '13/09/1990'))
        this.#pacientes.push(new Paciente('04804543023', 'Fulano de tal 2', '14/09/1991'))
        this.#pacientes.push(new Paciente('83045508065', 'Fulano de tal 3', '15/09/1992'))
        this.#pacientes.push(new Paciente('94143676087', 'Fulano de tal 4', '16/09/1993'))
        this.#pacientes.push(new Paciente('27438131050', 'Fulano de tal 5', '17/09/1994'))
        this.#pacientes.push(new Paciente('57045385099', 'Fulano de tal 6', '18/09/1995'))
        this.#pacientes.push(new Paciente('29287381003', 'Fulano de tal 7', '19/09/1996'))
        this.#pacientes.push(new Paciente('49381817030', 'Fulano de tal 8', '20/09/1997'))
        this.#pacientes.push(new Paciente('81511299053', 'Fulano de tal 9', '21/09/1998'))
        this.#pacientes.push(new Paciente('20279119011', 'Fulano de tal 10', '22/09/1999'))
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
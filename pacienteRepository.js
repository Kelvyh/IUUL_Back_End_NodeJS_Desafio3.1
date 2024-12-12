import { Paciente } from './paciente.js';
import { pacienteDAO } from './daos/pacienteDAO.js';

class PacienteRepository {
    #pacienteDAO = new pacienteDAO();

    async addPaciente(cpf, nome, dataNascimento) {
        let paciente = new Paciente(cpf, nome, dataNascimento);
        await this.#pacienteDAO.addPaciente(paciente);
    }
    
    async excluirPaciente(cpf) {
        let paciente = await this.#pacienteDAO.excluirPaciente(cpf);
        if (paciente) {
            console.log('Paciente excluído com sucesso!');
        } else {
            console.log('Erro: paciente não cadastrado');
        }
    }

    async getPacienteByCpf(cpf) {
        return await this.#pacienteDAO.getPacienteByCpf(cpf);
    }

    async getPacientesPorCpf() {
        return await this.#pacienteDAO.listar('cpf', 'asc');
    }

    async getPacientesPorNome() {
        return await this.#pacienteDAO.listar('nome', 'asc');
    }
}

export { PacienteRepository }
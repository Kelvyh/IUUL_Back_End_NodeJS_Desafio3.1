class Paciente {
    #cpf
    #nome
    #dataNascimento

    constructor(cpf, nome, dataNascimento) {
        try {
            this.#testeCpf(cpf)
            this.#cpf = cpf
            this.#testeNome(nome)
            this.#nome = nome
            this.#testeFormatoData(dataNascimento)
            this.#dataNascimento = dataNascimento
        } catch (error) {
            console.log(error.message)
        }
    }

    get cpf() {
        return this.#cpf
    }

    get nome() {
        return this.#nome
    }

    get dataNascimento() {
        return this.#dataNascimento
    }
    
    #testeCpf(cpf) {
            if (cpf.length !== 11) {
                throw new Error('CPF precisa ter 11 dígitos');
            }

            const digitosCpf = cpf.split('').map(Number);

            if (digitosCpf.every(digito => digito === digitosCpf[0])) {
                throw new Error('CPF não pode ter todos os dígitos iguais');
            }

            const verificador1 = digitosCpf.slice(0, 9).reduce((sum, digit, index) => sum + digit * (10 - index), 0) % 11;
            const testeDigito1 = (verificador1 < 2) ? 0 : (11 - verificador1);

            const verificador2 = digitosCpf.slice(0, 10).reduce((sum, digit, index) => sum + digit * (11 - index), 0) % 11;
            const testeDigito2 = (verificador2 < 2) ? 0 : (11 - verificador2);

            if (testeDigito1 !== digitosCpf[9] || testeDigito2 !== digitosCpf[10]) {
                throw new Error('CPF inválido');
            }
    }
    
    #testeNome(nome) {
        if(nome.length < 5) {
            throw new Error('Nome precisa ter no mínimo 5 caracteres');
        }
    }

    #testeFormatoData(dataNascimento) {
        if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
            throw new Error('Data de nascimento precisa estar no formato DD/MM/AAAA');
        }
    }

    toString() {
        return `CPF: ${this.#cpf}, Nome: ${this.#nome}, Data de nascimento: ${this.#dataNascimento}`
    }
}

export {Paciente}
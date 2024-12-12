class Consulta {
    #paciente
    #data
    #horaInicio
    #horaFim

    constructor(paciente, data, horaInicio, horaFim) {
        this.#paciente = paciente
        this.#data = data
        this.#horaInicio = horaInicio
        this.#horaFim = horaFim
    }

    get paciente() {
        return this.#paciente
    }

    get data() {
        return this.#data
    }

    get horaInicio() {
        return this.#horaInicio
    }

    get horaFim() {
        return this.#horaFim
    }

    toString() {
        return `${this.#data} ${this.#horaInicio} ${this.#horaFim} ${this.#paciente.nome} ${this.#paciente.dataNascimento}`;
    }
}

export {Consulta}
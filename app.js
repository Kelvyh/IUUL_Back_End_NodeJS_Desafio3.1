import { sequelize } from "./db.js";
import { setupModels } from "./models/setupModels.js";
import { main } from "./menu.js";

async function app() {
    try {
        await sequelize.authenticate();
        console.log("Conectado ao banco de dados com sucesso.");
    } catch (error) {
        console.error("Não foi possível conectar ao banco de dados: ", error);
    }

    setupModels();

    try {
        await sequelize.sync();
        await main();
    } catch (error) {
        console.error("Não foi possível sincronizar com o banco de dados: ", error);
    }
}

app();
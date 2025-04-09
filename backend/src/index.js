//Importando as bibliotecas
import express from 'express';
import cors from 'cors';
import { Mongo } from './database/mongo.js';
import { config } from 'dotenv';
import authRouter from './auth/auth.js';
import usersRouter from './routes/users.js';

//Chamada das configuracoes do ambiente
config();

async function main () {
    const hostname = 'localhost';
    const port = 3000;

    //Criacao da aplicacao com express
    const app = express();

    //Conectando com o banco
    const mongoConnection = await Mongo.connect({ mongoConnectionString: process.env.MONGO_CS, mongoDBName: process.env.MONGO_DB_NAME });
    console.log(mongoConnection);

    //Resposta do servidor
    app.use(express.json());
    app.use(cors());

    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: 'Bem vindo a Aplicação!'
        })
    });

    //Rotas
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);

    app.listen(port, () => {
        console.log(`Server running on: http://${hostname}:${port}`)
    });
}

main();
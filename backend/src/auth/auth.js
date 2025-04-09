//Configuracao de login com autenticacao de email e senha

//Imports
import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import { Mongo } from '../database/mongo.js';  
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

//Criando colecao de usuarios
const collectionName = 'users';

//Estrategia local de autenticacao
passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, callback) => {

    //Procura o usuario com email informado
    const user = await Mongo.db
    .collection(collectionName)
    .findOne({ email: email});

    //Se nao encontrado, cancela o login
    if(!user){
        return callback(null, false);
    }

    //Pegando o salt para gerar a senha criptografada
    const saltBUffer = user.salt.buffer;

    //Recalculando o hash da senha para comparar com a salva
    //310000: número de iterações.
    //16: tamanho do hash gerado.
    //'sha256': algoritmo de hash.
    crypto.pbkdf2(password, saltBUffer, 310000, 16, 'sha256', (err, hashedPassword) => {
        if(err){
            return callback(null, false);
        }

        const userPasswordBuffer = Buffer.from(user.password.buffer);

        //Compara o hash da senha digitada com o hash da senha salva no banco.
        if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)){
            return callback(null, false);
        }

        //Separa a senha e o salt do usuário e retorna o restante
        const { password, salt, ...rest } = user;
        return callback(null, rest);
    })
}))

//Criacao da rota
const authRouter = express.Router();

//Definindo a rota POST/signup
authRouter.post('/signup', async (req, res) =>{

    //Verifica se o usuario existe
    const checkUser = await Mongo.db
    .collection(collectionName)
    .findOne({ email: req.body.email});

    if(checkUser){
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: {
                text: 'User already exists!'
            }
        })
    }

    //Gerando senha criptografada
    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if(err){
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error on crypt password!',
                    err: err
                }
            })
        }

        //Inserindo usuario no banco [email, senha e salt]
        const result = await Mongo.db
        .collection(collectionName)
        .insertOne({
            email: req.body.email,
            password: hashedPassword,
            salt
        })

        //Se o cadastro funcionar gera um token JWT para o usuario
        if(result.insertedId){
            const user = await Mongo.db
            .collection(collectionName)
            .findOne( { _id: new ObjectId(result.insertedId)})

            const token = jwt.sign(user, 'secret');

            //Retorno da API do cadastro
            return res.send({
                success: true,
                statusCode: 200,
                body: {
                    text: 'User registred correctly!',
                    token,
                    user,
                    logged: true
                }
            })
        }
    })
})

//Definindo a rota POST/signin
authRouter.post('/login', async (req, res) =>{

    // Tenta autenticar o usuário com a estratégia "local" do Passport (e-mail e senha)
    passport.authenticate('local', (error, user) => {
        if(error){
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error during authentication',
                    error
                }
            })
        }

        //Verifica se o usuario existe
        if(!user){
            return res.status(400).send({
                success: false,
                statusCode: 400,
                body: {
                    text: 'Credentials are not corrected!',
                }
            })
        }

       // Se a autenticação for bem-sucedida, gera um token JWT para o usuário
        const token = jwt.sign(user, 'secret');
        return res.status(200).send({
            success: true,
            statusCode: 200,
            body: {
                text: 'User logged in correctly!',
                user,
                token
            }
        })
    })(req, res) //Executa a funcao
})

export default authRouter;
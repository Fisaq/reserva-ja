import { Mongo } from '../database/mongo.js';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

const collectionName = 'users';

export default class UsersDataAccess {

    //Obter a lista de usuarios
    async getUsers(){
       const result = await Mongo.db
       .collection(collectionName)
       .find({}) //Pega todos os dados da tabela users
       .toArray(); //Transforma o retorno em uma lista

       return result;
    };

    //Deletar usuario
    async deleteUser(userId){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(userId) }); //Encontra o usuario com o ID e deleta o usuario do banco
 
        return result;
    }

    //Atualizar dados usuario
    async updateUser(userId, userData){

        //Se houver atualizacao de password
        if(userData.password){

            //Logica de criptografia da senha
            const salt = crypto.randomBytes(16)

            crypto.pbkdf2(userData.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
                if(err){
                    throw new Error('Error during hasing password');
                }

                userData = { ...userData, password: hashedPassword, salt };

                //Inserindo usuario no banco [email, senha e salt]
                const result = await Mongo.db
                .collection(collectionName)
                .findOneAndUpdate(
                    { _id: new ObjectId(userId) }, //Encontra o usuario com o ID
                    { $set: userData })//Atualiza os dados do usuario
                })

                return result;

        }else{

            const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(userId) }, 
                { $set: userData }
            ); 
            return result;

        }      
    }
}
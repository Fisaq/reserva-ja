import { Mongo } from '../database/mongo.js';
import { ObjectId } from 'mongodb';

const collectionName = 'plates';

export default class PlatesDataAccess {

    //Obter a lista de pratos
    async getPlates(){
       const result = await Mongo.db
       .collection(collectionName)
       .find({}) //Pega todos os dados da tabela plates
       .toArray(); //Transforma o retorno em uma lista

       return result;
    };

    //Retorna somente os pratos que estão disponíveis
    async getAvailablePlates(){
        const result = await Mongo.db
        .collection(collectionName)
        .find({ available: true}) 
        .toArray(); 
 
        return result;
     };

     //Adicionar prato
     async addPlate(plateData){
        const result = await Mongo.db
        .collection(collectionName)
        .insertOne(plateData);

        return result;
     };

    //Deletar prato
    async deletePlate(plateId){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(plateId) }); //Encontra o prato com o ID e deleta o prato do banco
 
        return result;
    };

    //Atualizar dados do prato
    async updatePlate(plateId, plateData){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(plateId) }, 
            { $set: plateData }
        ); 

        return result;
    };   
}
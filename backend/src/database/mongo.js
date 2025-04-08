import {MongoClient} from 'mongodb';

export const Mongo = {
    //Funcao de conexao com o banco
    async connect({mongoConnectionString, mongoDBName}){

        //Tentando fazer conexao com o cliente
        try{
            const client = new MongoClient(mongoConnectionString);

            await client.connect();
            const db = client.db(mongoDBName);

            this.client = client;
            this.db = db;

            return 'Connected to mongo!';


        } catch(error){
            return { text: 'Error during mongo connection', error};
        }
        
    }
}

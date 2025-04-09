import { Mongo } from '../database/mongo.js';
import { ObjectId } from 'mongodb';

const collectionName = 'orders';

export default class OrdersDataAccess {

    //Obter a lista de ordens
    async getOrders(){
       const result = await Mongo.db
       .collection(collectionName)

       //Utilizando aggregate para manipular o retorno da requisicao
       .aggregate([
            //Assim é possível obter melhores detalhes do usuario, do prato e da ordem na mesma requisicao
            {
                $lookup:{
                    from: 'orderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderItems'
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                //Ocultando os dados sensíveis do usuario
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                //Detalhe dos pratos
                $lookup: {
                    from: 'plates',
                    localField: 'orderItems.plateId',
                    foreignField: '_id',
                    as: 'orderItems.itemDetails'
                }
            },
       ])
       .toArray(); //Transforma o retorno em uma lista

       return result;
    };

     //Adicionar ordem
     async addOrder(orderData){
        const { items, ...orderDataRest } = orderData;

        orderDataRest.createdAt = new Date(); //Retorna o horario atual
        orderDataRest.pickupStatus = 'Pending'; //Estado da ordem (defalt : pendente)
        orderDataRest.userId = new ObjectId(orderDataRest.userId); //Transforma a ID recebido (string) em um objectId

        //Retorna um insertedId do banco
        const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest);

        //Se não retornado um insertedId
        if(!newOrder.insertedId){
            throw new Error('Order cannot be inserted!'); //Mensagem de erro
        }

        //Mapeia cada item da lista de items
        items.map((items) => {
            items.plateId = new ObjectId(items.plateId); //Recebe o id do prato
            items.orderId = new ObjectId(newOrder.insertedId); //Recebe o id da ordem
        })

        const result = await Mongo.db
        .collection('orderItems')
        .insertMany(items);

        return result;
     };

    //Deletar ordem
    async deleteOrder(orderId){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(orderId) }); //Encontra a ordem com o ID e deleta a ordem do banco
 
        return result;
    };

    //Atualizar dados de uma ordem
    async updateOrder(orderId, orderData){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(orderId) }, 
            { $set: orderData }
        ); 

        return result;
    };   
}
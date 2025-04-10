import OrdersDataAccess from "../dataAccess/orders.js";
import {ok, serverError} from '../helpers/httpResponse.js';

export default class OrderControllers{
    constructor(){
        this.dataAccess = new OrdersDataAccess();
    }

    //Controller para criacao de ordens
    async getOrders() {
        try{
            const orders = await this.dataAccess.getOrders();

            console.log(orders);

            return ok(orders);
        }catch (error){
            return serverError(error);
        }
    };

    //Controller para a insercao de uma ordem
    async addOrder(orderData) {
        try{
            const result = await this.dataAccess.addOrder(orderData);

            return ok(result);
        }catch (error){
            return serverError(error);
        }
    };

    //Controller para a exclusao de uma ordem
    async deleteOrder(orderId) {
        try{
            const result = await this.dataAccess.deleteOrder(orderId);

            return ok(result);
        }catch (error){
            return serverError(error);
        }
    };

    //Controller para a atualizacao de uma ordem
    async updateOrder(orderId, orderData) {
        try{
            const result = await this.dataAccess.updateOrder(orderId, orderData);

            return ok(result);
        }catch (error){
            return serverError(error);
        }
    };
}
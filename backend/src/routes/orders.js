import express from 'express';
import OrderControllers from '../controllers/orders.js';

const ordersRouter = express.Router();
const ordersControllers = new OrderControllers();

//Controle das rotas

//GET
ordersRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.getOrders();

    res.status(statusCode).send({ success, statusCode, body });
})

//ADD
ordersRouter.post('/', async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.addOrder(req.body);

    res.status(statusCode).send({ success, statusCode, body });

});

//DELETE
ordersRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.deleteOrder(req.params.id);

    res.status(statusCode).send({ success, statusCode, body });

});

//UPDATE
ordersRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await ordersControllers.updateOrder(req.params.id, req.body)

    res.status(statusCode).send({ success, statusCode, body });

});

export default ordersRouter;
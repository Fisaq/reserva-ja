import express from 'express';
import PlatesControllers from '../controllers/plates.js';

const platesRouter = express.Router();
const platesControllers = new PlatesControllers();

//Controle das rotas

//GET
platesRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await platesControllers.getPlates();

    res.status(statusCode).send({ success, statusCode, body });
})

//ADD
platesRouter.post('/', async (req, res) => {
    const { success, statusCode, body } = await platesControllers.addPlate(req.body);

    res.status(statusCode).send({ success, statusCode, body });

});

//GET AVAILABLE
platesRouter.get('/availables', async (req, res) => {
    const { success, statusCode, body } = await platesControllers.getAvailablePlates();

    res.status(statusCode).send({ success, statusCode, body });
})

//DELETE
platesRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await platesControllers.deletePlate(req.params.id);

    res.status(statusCode).send({ success, statusCode, body });

});

//UPDATE
platesRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await platesControllers.updatePlate(req.params.id, req.body);

    res.status(statusCode).send({ success, statusCode, body });

});

export default platesRouter;
import express from 'express';
import UsersControllers from '../controllers/users.js';

const usersRouter = express.Router();

const usersControllers = new UsersControllers();

//Controle das rotas

//GET
usersRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await usersControllers.getUsers();

    res.status(statusCode).send({ success, statusCode, body });
})

//DELETE
usersRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await usersControllers.deleteUser(req.params.id);

    res.status(statusCode).send({ success, statusCode, body });

});

//UPDATE
usersRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await usersControllers.updateUser(req.params.id, req.body);

    res.status(statusCode).send({ success, statusCode, body });

});

export default usersRouter;
import { Router } from 'express';
import { poolDatabase } from '../services/connectionDatabase.js';
import { TokenMiddleware } from '../middleware/tokenMiddleware.js';
import { UserController } from '../controllers/user.controller.js';

const userRouter = Router();

const userController = new UserController(poolDatabase);
const tokenMiddleware = new TokenMiddleware(poolDatabase);


userRouter.get('',
    (req, res, next) => tokenMiddleware.validAcessUser(req, res, next),
    (req, res, next) => userController.getAllUsers(req, res, next));

userRouter.put('/:id',
    (req, res, next) => tokenMiddleware.validAcessUser(req, res, next),
    (req, res, next) => userController.updateUser(req, res, next));

userRouter.delete('/:id',
    (req, res, next) => tokenMiddleware.validAcessUser(req, res, next),
    (req, res, next) => userController.deleteUser(req, res, next));

export default userRouter;
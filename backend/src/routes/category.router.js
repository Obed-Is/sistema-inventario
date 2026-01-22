import { Router } from 'express';
import { TokenMiddleware } from '../middleware/tokenMiddleware.js';
import { poolDatabase } from '../services/connectionDatabase.js';
import { CategoryController } from "../controllers/category.controller.js";

const categoryRouter = Router();
const tokenMiddle = new TokenMiddleware(poolDatabase);
const categoryController = new CategoryController(poolDatabase);

categoryRouter.get('/:page',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => categoryController.getCategories(req, res, next));

categoryRouter.post('/create',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => categoryController.createrCategory(req, res, next));

categoryRouter.put('/:id',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => categoryController.updateCategory(req, res, next));

categoryRouter.delete('/:id',
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => categoryController.deleteCategory(req, res, next));

export default categoryRouter;
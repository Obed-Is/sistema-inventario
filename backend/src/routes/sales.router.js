import { Router } from "express";
import { TokenMiddleware } from '../middleware/tokenMiddleware.js';
import { poolDatabase } from '../services/connectionDatabase.js';
import { SalesController } from "../controllers/sales.controller.js";

const productRouter = Router();
const tokenMiddle = new TokenMiddleware(poolDatabase);
const salesController = new SalesController(poolDatabase);

const salesRouter = Router();

salesRouter.post('/new', 
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => salesController.createNewSale(req, res, next));


export default salesRouter;
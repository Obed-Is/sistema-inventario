import { Router } from 'express';
import { TokenMiddleware } from '../middleware/tokenMiddleware.js';
import { poolDatabase } from '../services/connectionDatabase.js';
import { PanelController } from '../controllers/panel.controller.js';

const panelRouter = Router();
const tokenMiddle = new TokenMiddleware(poolDatabase);
const panelController = new PanelController(poolDatabase);

panelRouter.get('/admin', 
    (req, res, next) => tokenMiddle.validAcessUser(req, res, next),
    (req, res, next) => panelController.getInfoPanel(req, res, next));

panelRouter.get('/bodega', 
    (req, res, next) => tokenMiddle.userIsLog(req, res, next),
    (req, res, next) => panelController.getInfoPanelBodega(req, res, next));
    
export default panelRouter;
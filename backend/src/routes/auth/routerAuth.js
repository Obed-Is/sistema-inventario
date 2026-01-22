import { Router } from 'express'
//importacion de archivos
import { poolDatabase } from '../../services/connectionDatabase.js';
import { UserController } from '../../controllers/user.controller.js';
import { TokenMiddleware } from '../../middleware/tokenMiddleware.js';

const router = Router();

// se inyecta la conexion o la pool de la base de datos a los controladores para
// posteriormente compartirla con todo lo demas
const userController = new UserController(poolDatabase);
const tokenMiddleware = new TokenMiddleware(poolDatabase);

router.get('/auth/session', 
    (req, res, next) => tokenMiddleware.userIsLog(req, res, next),
    (req, res, next) => userController.userSession(req, res, next));

router.post('/create', (req, res, next) => userController.createUser(req, res, next));
router.post('/login', 
    (req, res, next) => tokenMiddleware.userIsLog(req, res, next),
    (req, res, next) => userController.loginUser(req, res, next));

router.post('/logout', (req, res, next) => userController.userSessionLogout(req, res));
export default router;
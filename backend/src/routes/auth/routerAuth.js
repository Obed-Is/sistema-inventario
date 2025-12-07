import { Router } from 'express'

//importacion de archivos
import { poolDatabase } from '../../services/connectionDatabase.js';
import { UserController } from '../../controllers/userController.js';

const router = Router();

// se inyecta la conexion o la pool de la base de datos a los controladores para
// posteriormente compartirla con todo lo demas
const userController = new UserController(poolDatabase);

router.post('/create', (req, res, next) => userController.createUser(req, res, next))
router.post('/login', (req, res, next) => userController.loginUser(req, res, next));

export default router;
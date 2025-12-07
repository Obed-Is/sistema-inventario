import { UserService } from "../services/userService.js";

export class UserController {
    constructor(db) {
        this.service = new UserService(db);
    }

    async createUser(req, res, next) {
        try {
            const userFinal = await this.service.newUser(req);

            if (!userFinal) {
                console.log('Ocurrio un error al crear el usuario en la base de datos');
                return res.status(500).json({ success: false, message: 'Ocurrio un error interno' })
            }

            return res.status(201).json({ success: true, message: 'Usuario creado' });
        } catch (err) {
            console.log('ERROR RECIBIDO EN EL CONTROLADOR: ', err)
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {
            const getUser = await this.service.getUser(req);
            console.log(getUser)
            if (!getUser) {
                return res.status(404).json({ success: false, message: 'Credenciales incorrectas' });
            }

            return res.json({ mensaje: 'se recibio' })
        } catch (err) {
            next(err);
        }
    }
}
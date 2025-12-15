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
            console.log('Error recibido en el controlador: ', err)
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {
            console.log('La sesion del usuario es valida? ',req.logIn);
            
            if (req.logIn) {
                return res.status(200).json({ logIn: true, message: 'El usuario ya esta logueado' });
            }

            res.clearCookie('refresh_token');
            res.clearCookie('acess_token');

            const getUser = await this.service.getUser(req);
            const { acessToken, refreshToken, ...userData } = getUser;

            return res.status(200)
                .cookie('refresh_token', refreshToken, {
                    httpOnly: true, sameSite: 'Strict'
                })
                .cookie('acess_token', acessToken, {
                    httpOnly: true, sameSite: 'Strict'
                })
                .json({ logIn: true, userData: userData.userLog })
        } catch (err) {
            next(err);
        }
    }
}
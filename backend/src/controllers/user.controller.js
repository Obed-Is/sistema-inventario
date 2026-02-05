import { UserService } from "../services/userService.js";

export class UserController {
    constructor(db) {
        this.service = new UserService(db);
    }

    async createUser(req, res, next) {
        try {
            const userFinal = await this.service.newUser(req);

            if (!userFinal) {
                return res.status(500).json({ success: false, message: 'Ocurrio un error interno' })
            }

            return res.status(201).json({ success: true, message: 'Usuario creado' });
        } catch (err) {
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {

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

    userSession(req, res, next) {
        if (req.logIn) {
            return res.status(200).json({ logIn: true })
        }
        return res.status(401).json({ logIn: false })
    }

    async userSessionLogout(req, res, next) {
        try {
            const acessToken = req.cookies.acess_token;
            await this.service.logoutUser(acessToken);
            req.logIn = false;

            return res.clearCookie('refresh_token').clearCookie('acess_token')
                .status(200).json({ logIn: false, message: 'Sesion cerrada' });
        } catch (err) {
            res.clearCookie('refresh_token').clearCookie('acess_token');
            next(err)
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const { page } = req.query;
            const users = await this.service.getUserService(page);
            res.status(200).json({ success: true, users });
        } catch (err) {
            next(err)
        }
    }

    async updateUser(req, res, next) {
        try {

            const { id } = req.params;
            const userUpdated = await this.service.updateUserService(id, req.body);

            if (!userUpdated.success) {
                return res.status(404).json({ success: false, message: userUpdated.message });
            }
            res.status(200).json({ success: true, message: userUpdated.message });
        } catch (err) {
            next(err);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const userDelete = await this.service.deleteUserService(id);

            if (!userDelete.success) {
                return res.status(404).json({ success: false, message: userDelete.message });
            }
            res.status(200).json({ success: true, message: userDelete.message });
        } catch (err) {
            next(err)
        }
    }
}
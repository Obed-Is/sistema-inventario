import jwt from "jsonwebtoken";
import { TokenService } from "../services/tokenService.js";
import { TokenError } from "../errors/errors.js";

//Middleware para la comprobacion de tokens y estado de la sesion del usuario 
export class TokenMiddleware {
    constructor(db) {
        this.tokenService = new TokenService(db);
    }

    async userIsLog(req, res, next) {
        const acessToken = req.cookies.acess_token;
        const refreshToken = req.cookies.refresh_token;

        try {
            if (!acessToken) {
                req.logIn = false;
                return next();
            }

            req.logIn = await this.tokenService.validAcessToken(acessToken) ? true : false;
            return next();
        } catch (err) {
            if (err.message !== 'jwt expired') {
                res.clearCookie('acess_token');
                res.clearCookie('refresh_token');
                throw new TokenError('Ocurrio un error en los tokens', 500);
            }
            try {
                const payload = jwt.decode(acessToken);
                const validRefreshToken = await this.tokenService.validRefreshToken(payload.id, refreshToken);
                // si lka comprobacion del refresh token es invalido se manda falso a la sesion
                if (!validRefreshToken) {
                    req.logIn = false;
                    return next();
                }
                //caso contrario se genera nuevo token de acceso y se mantiene la sesion
                const newAcessToken = await this.tokenService.newAcessToken(payload.id, payload.correo, payload.nombre, payload.nombre_rol);

                res.cookie('acess_token', newAcessToken, {
                    httpOnly: true, sameSite: 'Strict'
                })
                req.logIn = true;
                return next();
            } catch (error) {
                throw error;
            }
        }
    }

    async validAcessTokens(req, res, next) {
        try {
            const acessToken = req.cookies.acess_token;
            if (!acessToken) {
                req.cookies.clear();
                return res.status().json({ logIn: false })
            }

        } catch (err) {
            const payload = tokenService.getPayloadAcessToken(req.cookies.acess_token);
            if (err.message == 'jwt expired') {
                // const isValidAcessToken = tokenService.validRefreshToken(payload.id, req.cookies.refresh_token)
            }
        }
        next();
    }


    async validAcessUser(req, res, next) {
        try {
            const payload = this.tokenService.getPayloadToken(req.cookies.acess_token);

            if (!payload) return res.status(403).json({ message: 'Acceso denegado', success: false });
            if (payload.nombre_rol.toLowerCase() != 'administrador') return res.status(403).json({ message: 'Acceso denegado', success: false });

            const request = await this.tokenService.userValidRol(payload.nombre_rol, payload.correo)
            if (!request) return res.status(403).json({ message: 'Acceso denegado', success: false });

            next()
        } catch (err) {
            return res.status(403).json({ message: 'Acceso denegado', success: false });
        }
    }
}
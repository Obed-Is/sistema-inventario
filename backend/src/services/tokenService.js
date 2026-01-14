import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/userModel.js';
import { TokenError, RolError } from '../errors/errors.js';

export class TokenService {
    constructor(db) {
        this.userModel = new UserModel(db);
        this.key_jwt = process.env.SECRET_KET_JWT;
    }

    newAcessToken(id, correo, nombre, nombre_rol) {
        return jwt.sign({ id, correo, nombre, nombre_rol }, this.key_jwt, {
            expiresIn: '1m'
        })
    }

    newRefreshToken(id) {
        //en este caso la expiracion es un poco ambigua ya q este token se hashea
        // y se guarda en la db para futuras comprobaciones seguras y enviarlo al frontend
        return jwt.sign({ id }, this.key_jwt, {
            expiresIn: '5m'
        })
    }

    async hashedRefreshToken(token) {
        return bcrypt.hash(token, parseInt(process.env.SALT_ROUND_HASH));
    }

    async validAcessToken(token) {
        return jwt.verify(token, this.key_jwt);
    }

    async validRefreshToken(id, token) {
        try {
            //se obtiene la info del token hasheado de la db
            const [tokenFromDb] = await this.userModel.getRefreshToken(id);

            if (!tokenFromDb[0]) return false;

            const tokenHash = tokenFromDb[0].token_hash;
            //el token de refresh debe venir hasheado por eso se manda directo a la validacion
            const isValid = await this.#tokenHashValid(token, tokenHash);

            if (!isValid) {
                return false;
            }

            const dateNow = Date.now();
            const expiredAt = new Date(tokenFromDb[0].expired_at).getTime();

            if (dateNow > expiredAt) {
                return false;
            }

            return true;
        } catch (err) {
            console.log('Error en el servicio de token, especificamente validRefreshToken', err);
            throw new TokenError('Ocurrio un error en los tokens', 500);
        }

    }

    async #tokenHashValid(token, tokenDb) {
        // se compara asi ya q los 2 deben exactamente el mismo por el hash q se aplica
        return (token === tokenDb);
    }

    //se genera la fecha de cuando expirara el refresh token(actualmente dura 1 jornada de trabajo osea 8 horas)
    formatExpiredToken() {
        const expired = new Date();
        expired.setHours(expired.getHours() + 8);
        expired.setSeconds(0)
        expired.setMilliseconds(0);
        return expired.toLocaleString('sv-SE');
    }

    getPayloadToken(token) {
        return jwt.decode(token);
    }

    async userValidRol(rol, correo) {
        try {
            const [request] = await this.userModel.validRol(rol, correo);

            if(!request[0]) return false;
            
            return (request[0].correo === correo) ? true : false;
        } catch (error) {
            throw new TokenError('Acceso denegado', 403);
        }
    }
}
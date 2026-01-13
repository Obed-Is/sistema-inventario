import { ValidationError, NotFoundError, DuplicateError, TokenError } from "../errors/errors.js";
import { UserModel } from "../models/userModel.js";
import { TokenService } from "./tokenService.js";
import { UserValidate } from "./userValidator.js";
import bcrypt from "bcrypt";

const validationUser = new UserValidate();

export class UserService {
    constructor(db) {
        this.userModel = new UserModel(db);
        this.tokenService = new TokenService(db);
    }

    async newUser(req) {
        const isValid = validationUser.validateNewUser(req.body);
        if (!isValid.valid) {
            throw new ValidationError(isValid.message, 422);
        }
        const { nombre, correo, telefono, rol } = req.body;

        const [userDuplicate] = await this.userModel.userDuplicate(correo, telefono);

        if (userDuplicate[0]) {
            throw new DuplicateError('Usuario duplicado', 409);
        }

        const hashContrasena = await this.hashedPassword(req.body.contrasena);
        const [idRolData] = await this.userModel.getIdByRol(rol);

        if (!idRolData[0]) {
            throw new NotFoundError('No se encontro el rol', 404);
        }

        const [newUserMetaData] = await this.userModel.createUserInDb(nombre, hashContrasena, correo, telefono, idRolData[0].id);

        return newUserMetaData.insertId;
    }

    async getUser(req) {
        const isValid = validationUser.validateLoginUser(req.body);

        if (!isValid.valid) {
            throw new ValidationError(isValid.message, 422);
        }

        const { correo, contrasena } = req.body;
        const [userData] = await this.userModel.getUserFromDb(correo);

        if (!userData[0]) {
            throw new ValidationError('Credenciales invalidas', 401);
        }

        const contrasenaValid = await this.compareHashPassword(contrasena, userData[0].contraseña);

        if (!contrasenaValid) {
            throw new ValidationError('Credenciales invalidas', 401);
        }

        const acessToken = this.tokenService.newAcessToken(
            userData[0].id, userData[0].correo, userData[0].nombre, userData[0].nombre_rol);
        let refreshToken = this.tokenService.newRefreshToken(
            userData[0].id);
        //aqui se debe hashear el refresh_token para guardarlo en la base de datos y luego enviarlo al front
        refreshToken = await this.tokenService.hashedRefreshToken(refreshToken);

        const userLog = {
            id: userData[0].id,
            nombre: userData[0].nombre,
            correo: userData[0].correo,
            nombre_rol: userData[0].nombre_rol
        }

        const [existTokenDb] = await this.userModel.getRefreshToken(userLog.id);

        if (existTokenDb[0]) {
            const expired = this.tokenService.formatExpiredToken();
            const updateToken = await this.userModel.updateRefreshToken(userLog.id, expired, refreshToken);
            if (!updateToken[0].affectedRows) {
                throw new TokenError('Ocurrio un error en la gestion los tokens', 500);
            }
        } else {
            const expired = this.tokenService.formatExpiredToken();
            const setToken = await this.userModel.setNewRefreshToken(userLog.id, refreshToken, expired);
            if (!setToken[0].insertId) {
                throw new TokenError('Error en guardar los tokens para la sesion', 500)
            }
        }
        console.log('Usuario recien logueado: ', userLog)
        delete userLog.id;

        return {
            userLog,
            acessToken,
            refreshToken
        };
    }

    async hashedPassword(contrasena) {
        return bcrypt.hash(contrasena, parseInt(process.env.SALT_ROUND_HASH));
    }

    async compareHashPassword(contrasena, hashContrasena) {
        return bcrypt.compare(contrasena, hashContrasena);
    }

    async logoutUser(acess_token) {
        try {
            if (!acess_token) {
                return null;
            }
            const { id } = this.tokenService.getPayloadToken(acess_token);
            const [result] = await this.userModel.invalidateTokenFromDb(id);
            return await result.affectedRows;
        } catch (err) {
            console.log('Ocurrio un error al invalidar la sesion(logout): ', err)
            throw new TokenError('Ocurrio un error interno', 500)
        }
    }

    async getUserService(page) {
        let limit = 5;
        let offset;

        if (page == 1 || !page) {
            offset = 0;
        } else {
            offset = limit * (page - 1);
        }

        try {
            const [users] = await this.userModel.allUsers(limit, offset);
            if (typeof users != 'object') throw new NotFoundError("No se pudo obtener los usuarios", 404);

            //se eliminan los datos de contraseña y el id del rol de los datos de usuarios
            users.forEach(usuario => {
                delete usuario.contraseña;
                delete usuario.id_rol;
            });

            return users;
        } catch (err) {
            console.log('Ocurrio un error al llamar la informacion de todos los usuarios: ', err);
            throw err;
        }
    }

    async updateUserService(id, campos) {
        try {
            const isValid = validationUser.validateUpdateUser(campos);
            if (!isValid.valid) {
                return { success: false, message: isValid.message };
            }

            const { nombre, correo, telefono, rol, contrasena, estado } = campos;

            if (contrasena && contrasena.trim()) {
                const hashContrasena = await this.hashedPassword(contrasena);

                const [updateContrasena] = await this.userModel.updateContrasenaInDb(id, hashContrasena);

                if (!updateContrasena.affectedRows) {
                    throw new NotFoundError('No se pudo actualizar la contraseña', 404);
                }
            }

            const [getIdRol] = await this.userModel.getIdByRol(rol);
            if (!getIdRol[0]) {
                throw new NotFoundError('No se encontro el rol', 404);
            }

            const [userUpdated] = await this.userModel.updateUserInDb(id, nombre, correo, telefono, getIdRol[0].id, estado);
            console.log('Usuario actualizado: ', userUpdated.affectedRows)
            if (!userUpdated.affectedRows) {
                throw new NotFoundError('No se pudo actualizar el usuario', 404);
            }

            return { success: true, message: 'Usuario actualizado' };
        } catch (err) {
            if(err.message.split(' ')[0].toLowerCase() === 'duplicate' ){
                throw new DuplicateError('Usuario duplicado', 409)
            }
            throw err;
        }
    }
}


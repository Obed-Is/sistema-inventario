import { ValidationError, NotFoundError, DuplicateError } from "../errors/errors.js";
import { UserModel } from "../models/userModel.js";
import { UserValidate } from "./userValidator.js";
import bcrypt from "bcrypt";

const validationUser = new UserValidate();

export class UserService {
    constructor(db) {
        this.userModel = new UserModel(db);
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
        if (!validationUser.validateLoginUser(req.body)) {
            throw new ValidationError('Campos incompletos', 422);
        }

        const { correo, contrasena } = req.body;
        const [userData] = await this.userModel.getUserFromDb(correo);
        console.log(userData);
        if (!userData) {
            return false;
        }
        return userData;
    }

    async hashedPassword(contrasena) {
        return await bcrypt.hash(contrasena, parseInt(process.env.SALT_ROUND_HASH));
    }
}


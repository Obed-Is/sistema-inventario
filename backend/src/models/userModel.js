
export class UserModel {
    constructor(db) {
        this.db = db;
    }

    async createUserInDb(nombre, contrasena, correo, telefono, id_rol) {
        try {
            return this.db.execute(`
                INSERT INTO usuarios (nombre, contraseña, correo, telefono, id_rol)
                VALUES (?, ?, ?, ?, ?)`, [nombre, contrasena, correo, telefono, id_rol]);
        } catch (err) {
            console.log('Error al crear un usuario en la base de datos: \n', err);
            throw err;
        }
    }

    async getUserFromDb(correo) {
        try {
            return this.db.query(`
                SELECT u.id, u.nombre, u.contraseña, u.correo, u.estado, r.nombre_rol FROM usuarios u 
                INNER JOIN roles r on r.id = u.id_rol WHERE u.correo = ? AND u.estado = 1`, [correo]);
        } catch (err) {
            console.log('Error en obtener el usuarios de la base de datos al intentar loguearse: \n', err)
            throw err;
        }
    }

    async getIdByRol(nombre_rol) {
        try {
            return this.db.query('SELECT id FROM roles WHERE nombre_rol = ?', [nombre_rol]);
        } catch (err) {
            console.log('Error al obtener el id del rol de la base de datos: \n', err)
            throw err;
        }
    }

    async userDuplicate(correo, telefono) {
        try {
            return this.db.query('SELECT id FROM usuarios WHERE correo = ? OR telefono = ?', [correo, telefono]);
        } catch (err) {
            console.log('Error al buscar un usuario duplicado en la base de datos: \n', err);
            throw err;
        }
    }

    async setNewRefreshToken(id_usuario, token, expired) {
        try {
            return this.db.execute(`INSERT INTO refresh_token (token_hash, id_usuario, expired_at)
            VALUES (?, ?, ?)`, [token, id_usuario, expired]);
        } catch (err) {
            console.log('Error al guardar el refresh token en la base de datos: \n', err);
            throw err;
        }
    }

    async getRefreshToken(id_usuario) {
        try {
            return this.db.query(`SELECT id, token_hash, expired_at FROM refresh_token WHERE id_usuario = ?`, [id_usuario]);
        } catch (err) {
            console.log('Error al obtener el token en la base de datos: \n', err);
            throw err;
        }
    }

    async updateRefreshToken(id_usuario, expired, token) {
        try {
            return this.db.execute(`UPDATE refresh_token SET token_hash = ?, expired_at = ? WHERE id_usuario = ?`,
                [token, expired, id_usuario]
            );
        } catch (err) {
            console.log('Error al actualizar el token en la base de datos: \n', err);
            throw err;
        }
    }

    async invalidateTokenFromDb(id_usuario) {
        try {
            return this.db.execute(`UPDATE refresh_token SET expired_at = "2000-12-12 00:00:00" WHERE id_usuario = ?`,
                [id_usuario]
            );
        } catch (err) {
            console.log('Error al invalidar el token en la base de datos: \n', err);
            throw err;
        }
    }

    async allUsers(limit, offset) {
        try {
            return this.db.query(`
                SELECT u.*, r.nombre_rol FROM usuarios u INNER JOIN roles r on r.id = u.id_rol 
                WHERE estado != -1 LIMIT ? OFFSET ? `,
                [limit, offset]
            );
        } catch (err) {
            console.log('Error al llamar todos los usuarios', err);
            throw err;
        }
    }

    async validRol(rol, correo) {
        try {
            return this.db.query(
                `SELECT u.correo FROM usuarios u INNER JOIN roles r on r.id = u.id_rol
                WHERE r.nombre_rol = ? AND u.correo = ?`,
                [rol, correo]);
        } catch (err) {
            console.log('Error al comprobar si el rol del usuario es valido', err);
            throw err;
        }
    }

    async updateUserInDb(id, nombre, correo, telefono, rol, estado) {
        try {
            return this.db.execute(`UPDATE usuarios SET nombre = ?, correo = ?, telefono = ?, id_rol = ?, estado = ? WHERE id = ?`,
                [nombre, correo, telefono, rol, estado, id]);
        } catch (err) {
            console.log('Error al actualizar el usuario en la base de datos: \n', err);
            throw err;
        }
    }

    async updateContrasenaInDb(id, contrasena) {
        try {
            return this.db.execute(`UPDATE usuarios SET contraseña = ? WHERE id = ?`, [contrasena, id]);
        } catch (err) {
            throw err;
        }
    }

    async getUserIdByRol(rol) {
        try {
            return this.db.query(`SELECT id FROM roles WHERE nombre_rol = ?`, [rol]);
        } catch (err) {
            throw err;
        }
    }
}
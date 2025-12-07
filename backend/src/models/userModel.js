
export class UserModel {
    constructor(db) {
        this.db = db;
    }

    async createUserInDb(nombre, contrasena, correo, telefono, id_rol) {
        try {
            return await this.db.execute(`
                INSERT INTO usuarios (nombre, contraseña, correo, telefono, id_rol)
                VALUES (?, ?, ?, ?, ?)`, [nombre, contrasena, correo, telefono, id_rol]);
        } catch (err) {
            console.log('Error al crear un usuario en la base de datos: \n', err);
            throw err;
        }
    }

    async getUserFromDb(correo) {
        try {
            return await this.db.query(`
                SELECT u.nombre, u.contraseña, u.correo, u.estado, r.nombre_rol FROM usuarios u 
                INNER JOIN roles r on r.id = u.id_rol WHERE u.correo = ?`, [correo]);
        } catch (err) {
            console.log('Error en obtener el usuarios de la base de datos: \n', err)
            throw err;
        }
    }

    async getIdByRol(nombre_rol) {
        try {
            console.log(nombre_rol)
            return await this.db.query('SELECT id FROM roles WHERE nombre_rol = ?', [nombre_rol]);
        } catch (err) {
            console.log('Error al obtener el id del rol de la base de datos: \n', err)
            throw err;
        }
    }

    async userDuplicate(correo, telefono) {
        try {
            return await this.db.query('SELECT id FROM usuarios WHERE correo = ? OR telefono = ?', [correo, telefono]);
        } catch (err) {
            console.log('Error al buscar un usuario duplicado en la base de datos: \n', err);
            throw err;
        }
    }
}
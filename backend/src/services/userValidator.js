export class UserValidate {
    constructor() {
        this.regexEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        this.regexTelefono = /^[26789]\d{7}$/;
        this.regexPassword = /^.{6,}$/;
    }

    validateNewUser(campos) {
        if (!campos) return { valid: false, message: "Datos no enviados" };

        let { nombre, correo, contrasena, telefono, rol } = campos;

        if (typeof nombre !== "string" ||
            typeof correo !== "string" ||
            typeof contrasena !== "string" ||
            typeof telefono !== "string" ||
            typeof rol !== "string") {
            return { valid: false, message: "Formato de datos invalido" };
        }

        nombre = nombre.trim();
        correo = correo.trim().toLowerCase();
        contrasena = contrasena.trim();
        telefono = telefono.trim();
        rol = rol.trim().toLowerCase();

        const rolesValidos = ["administrador", "bodega", "cajero"];

        if (!nombre || !correo || !contrasena || !telefono || !rol)
            return { valid: false, message: "Todos los campos son obligatorios" };

        if (nombre.length < 4)
            return { valid: false, message: "El nombre debe tener al menos 4 caracteres" };

        if (!this.regexEmail.test(correo))
            return { valid: false, message: "Correo invalido" };

        if (!this.regexTelefono.test(telefono))
            return { valid: false, message: "Telefono invalido" };

        if (!this.regexPassword.test(contrasena))
            return { valid: false, message: "La contraseña debe tener minimo 6 caracteres" };

        if (!rolesValidos.includes(rol))
            return { valid: false, message: "Rol no permitido" };

        return { valid: true };
    }


    validateLoginUser(campos) {
        const { correo, contrasena } = campos;

        if (!correo || !contrasena || contrasena.length <= 0) {
            return { valid: false, message: "Todos los campos son obligatorios" };
        } else if (!this.regexEmail.test(correo)) {
            return { valid: false, message: "Correo electronico invalido" };
        }

        return { valid: true };
    }

    validateUpdateUser(campos) {
        if (!campos) return { valid: false, message: "Datos no enviados" };

        let { nombre, correo, telefono, rol, contrasena, estado } = campos;

        nombre = nombre.trim();
        correo = correo.trim().toLowerCase();
        telefono = telefono.trim();
        rol = rol.trim().toLowerCase();
        estado = parseInt(estado);
        
        if(contrasena) {
            contrasena = contrasena.trim();
            if (!this.regexPassword.test(contrasena))
                return { valid: false, message: "La contraseña debe tener minimo 6 caracteres" };
        }

        if (!nombre || !correo || !telefono || !rol) {
            return { valid: false, message: "Todos los campos son obligatorios" };
        }

        if (nombre.length < 4)
            return { valid: false, message: "El nombre debe tener al menos 4 caracteres" };

        if (!this.regexEmail.test(correo))
            return { valid: false, message: "Correo invalido" };

        if (!this.regexTelefono.test(telefono))
            return { valid: false, message: "Telefono invalido" };

        const rolesValidos = ["administrador", "bodega", "cajero"];

        if (!rolesValidos.includes(rol))
            return { valid: false, message: "Rol no permitido" };

        if (estado !== 1 && estado !== 0 && estado !== -1)
            return { valid: false, message: "Estado no permitido" };

        return { valid: true };
    }
}
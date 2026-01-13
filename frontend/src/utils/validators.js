export const validEmail = (email) => {
    const regexCorreo = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (!email.trim() || !regexCorreo.test(email))
        return "Ingrese una direccion de correo electronico valida";
    return;
}

export const validPassword = (pass) => {
    if (!pass.trim())
        return 'La contraseña es obligatoria';
    if (pass.length < 6)
        return 'La contraseña debe tener al menos 6 caracteres';
    if (pass.length > 20)
        return 'La contraseña es demasiado larga';

    return;
}

const regexTelefono = /^[26789]\d{7}$/;
// VALIDACION DEL MODAL
export const validateUserForm = (formData, mode = 'create') => {
    const errors = {};
    let isValid = true;

    if (!formData.nombre || !formData.nombre.trim()) {
        errors.nombre = 'El nombre es requerido';
        isValid = false;
    }

    if (!formData.email || !formData.email.trim()) {
        errors.email = 'El email es requerido';
        isValid = false;
    } else {
        const emailError = validEmail(formData.email);
        if (emailError) {
            errors.email = emailError;
            isValid = false;
        }
    }

    if (!formData.telefono || !formData.telefono.trim()) {
        errors.telefono = 'El teléfono es requerido';
        isValid = false;
    } else if (!regexTelefono.test(formData.telefono.trim())) {
        errors.telefono = 'Teléfono inválido. Debe empezar con 2, 6, 7, 8 o 9 y tener 8 dígitos';
        isValid = false;
    }

    if (!formData.rol) {
        errors.rol = 'El rol es requerido';
        isValid = false;
    }

    if (mode === 'create') {
        // En modo crear, la contraseña es obligatoria
        if (!formData.password) {
            errors.password = 'La contraseña es requerida';
            isValid = false;
        } else {
            const passwordError = validPassword(formData.password);
            if (passwordError) {
                errors.password = passwordError;
                isValid = false;
            }
        }

        if (formData.password !== formData.passwordConfirm) {
            errors.passwordConfirm = 'Las contraseñas no coinciden';
            isValid = false;
        }
    } else if (mode === 'edit') {
        // En modo editar, la contraseña es opcional, pero si se ingresa, debe cumplir requisitos
        if (formData.password || formData.passwordConfirm) {
            if (!formData.password) {
                errors.password = 'Debe ingresar la nueva contraseña';
                isValid = false;
            } else {
                const passwordError = validPassword(formData.password);
                if (passwordError) {
                    errors.password = passwordError;
                    isValid = false;
                }
            }

            if (!formData.passwordConfirm) {
                errors.passwordConfirm = 'Debe confirmar la nueva contraseña';
                isValid = false;
            } else if (formData.password !== formData.passwordConfirm) {
                errors.passwordConfirm = 'Las contraseñas no coinciden';
                isValid = false;
            }
        }
    }

    return { isValid, errors };
}
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
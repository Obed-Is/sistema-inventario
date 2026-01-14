import { DuplicateError, NotFoundError, ValidationError, TokenError, RolError } from "../errors/errors.js";

export const errorHandler = (err, req, res, next) => {

    if (err instanceof ValidationError) {
        console.log("ESTE ES UN ERROR DE VALIDACION");
        return res.status(err.status).json({ success: false, message: err.message });
    }

    if (err instanceof NotFoundError) {
        return res.status(err.status).json({ success: false, message: err.message });
    }

    if (err instanceof DuplicateError) {
        return res.status(err.status).json({ success: false, message: err.message });
    }

    if (err instanceof TokenError) {
        return res.status(err.status).json({ success: false, message: err.message });
    }

    if (err instanceof RolError) {
        return res.status(err.status).json({ success: false, message: err.message });
    }

    if (err instanceof DeleteError) {
        return res.status(err.status).json({ success: false, message: err.message });
    }
    
    console.log('Error no capturado: ', err)
    return res.status(500).json({ success: false, message: 'Error interno' });
}
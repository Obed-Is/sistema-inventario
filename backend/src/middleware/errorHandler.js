import { DuplicateError, NotFoundError, ValidationError, TokenError, RolError, DeleteError } from "../errors/errors.js";

export const errorHandler = (err, req, res, next) => {

    if (err instanceof ValidationError) {
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
    
    return res.status(500).json({ success: false, message: 'Error interno' });
}
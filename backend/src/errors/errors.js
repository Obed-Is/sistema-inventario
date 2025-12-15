export class ValidationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        //muestra la info del error como archivo, linea js etc..
        this.stack = false;
    }
} 

export class NotFoundError extends Error{
    constructor(message, status){
        super(message),
        this.status = status;
        this.stack = false;
    }
}

export class DuplicateError extends Error{
    constructor(message, status){
        super(message),
        this.status = status;
        this.stack = false;
    }
}

export class TokenError extends Error{
    constructor(message, status){
        super(message),
        this.status = status,
        this.stack = false
    }
}
export class AppError extends Error {

    constructor(message, status = 500) {

        super(message);

        this.status = status;

    }

}

export class ValidationError extends AppError {

    constructor(message){

        super(message,400);

    }

}

export class UnauthorizedError extends AppError {

    constructor(){

        super("Unauthorized",401);

    }

}

export class NotFoundError extends AppError {

    constructor(message){

        super(message,404);

    }

}
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export class BadRequestException extends ApiError {
    constructor(message: string = 'Invalid input body') {
        super(400, message);
    }
}

export class UnauthorizedException extends ApiError {
    constructor(message: string = 'Invalid credentials') {
        super(401, message);
    }
}

export class NotFoundException extends ApiError {
    constructor(message: string = 'Not Found') {
        super(404, message);
    }
}

export class ConflictException extends ApiError {
    constructor(message: string = 'Conflict') {
        super(409, message);
    }
}

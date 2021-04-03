class HttpException extends Error{
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

class BadRequest extends HttpException {
    constructor(message) {
        super(400, message || 'Bad Request');
    }
}

class Unauthorized extends HttpException {
    constructor(message) {
        super(401, message || 'Unathorized');
    }
}

class NotFound extends HttpException {
    constructor(message) {
        super(404, message || 'Not Found');
    }
}

module.exports = {
    BadRequest,
    Unauthorized,
    NotFound
};
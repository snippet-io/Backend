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
class Forbidden extends HttpException {
    constructor(message) {
        super(403, message || 'Forbidden');
    }
}
class BadVerificationCode extends Unauthorized {
    constructor() {
        super('해당 code값으로 인증할 수 없습니다.');
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
    Forbidden,
    BadVerificationCode,
    NotFound
};
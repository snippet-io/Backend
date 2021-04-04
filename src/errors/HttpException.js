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
class InvalidServerConfiguration extends HttpException{
    constructor() {
        super(500, "서버가 잘 못 구성되었습니다.");
    }
}
module.exports = {
    BadRequest,
    Unauthorized,
    BadVerificationCode,
    NotFound,

    InvalidServerConfiguration
};
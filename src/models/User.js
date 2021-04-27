const ModelBuilder = require('./ModelBuilder');

class User {
    getId() {
        return this.id;
    }
    addCode(code) {
        this.codes.push(code);
    }
}

class UserBuilder extends ModelBuilder{
    constructor(id) {
        super(User);
        this.id = id;
        this.codes = [];
    }
}
module.exports = {
    User,
    UserBuilder
};
const ModelBuilder = require('./ModelBuilder');

class User {
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    addCode(code) {
        this.codes.push(code);
    }
}

class UserBuilder extends ModelBuilder{
    constructor(id, name) {
        super(User);
        this.id = id;
        this.name = name;
        this.codes = [];
    }
}
module.exports = {
    User,
    UserBuilder
};
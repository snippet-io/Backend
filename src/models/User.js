const ModelBuilder = require('./ModelBuilder');

class User {
    getId() {
        return this.id;
    }
}

class UserBuilder extends ModelBuilder{
    constructor(id) {
        super(User);
        this.id = id;
    }
}
module.exports = {
    User,
    UserBuilder
};
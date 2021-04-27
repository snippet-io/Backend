const { UserBuilder } = require("../../models/User");



const UserQueryBuilder = jest.fn()
    .mockImplementation(() => ({
        all: true,
        findAll: function () {
            this.result = db;
            return this;
        },
        create: function (user) {
            db.push(user);
            return this;
        },
        excute: function () {
            if(this.cb) {
                return this.cb(this.result).length;
            }
            return this.result;
        }
    }));

UserQueryBuilder.mockClear = () => {
    db = [ new UserBuilder(5).build() ];
}

module.exports = UserQueryBuilder;
const { UserBuilder } = require('../../../models/User');

let mocking_user_datas;
const mock = {};
mock.mockClear = jest.fn().mockImplementation(() => {
    mocking_user_datas = [ new UserBuilder(5).build() ];

});
mock.repo = {
    hasMany: jest.fn(),
    belongsTo: jest.fn()
}

mock.findAll = jest.fn()
    .mockImplementation(() => {
        return mocking_user_datas;
    });
mock.create = jest.fn()
    .mockImplementation((user) => {
        const new_user = new UserBuilder(user.getId()).build();
        mocking_user_datas.push(new_user);
    });

module.exports = mock;
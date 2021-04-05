function mockAllRepo() {
    jest.mock('../repositories/definitions/UserRepo');
    jest.mock('../repositories/definitions/CodeRepo');
}

module.exports = {
    mockAllRepo
}
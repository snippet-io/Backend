class CustomRepo {
    static addScope() {
        return this.repo.addScope(...arguments);
    }
    static scope() {
        const instance = new this;
        instance.scopes = arguments;
        return instance;
    }
}

module.exports = CustomRepo;
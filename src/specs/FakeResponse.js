class FakeResponse {
    status(code) {
        this.code = code;
    }
    getStatus() {
        return this.code;
    }
}

module.exports = FakeResponse;
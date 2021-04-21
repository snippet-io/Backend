class FakeRequest {
    constructor(data) {
        this.body = data.body || {};
        this.params = data.params || {};
        this.auth = data.auth || {};
        this.header = data.header || {};
        this.query = data.query || {};
    }
    get(attribute) {
        return this.header[attribute];
    }
}
class FakeRequestBuilder {
    setHeader(header) {
        this.header = header;
        return this;
    }
    setParams(params) {
        this.params = params;
        return this;
    }
    setQuery(query) {
        this.query = query;
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    setAuth(auth) {
        this.auth = auth;
        return this;
    }
    build() {
        return new FakeRequest(this);
    }
}

module.exports = FakeRequestBuilder;
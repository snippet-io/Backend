class FakeResponse {
    constructor() {
        this.result = {};
    }
    send(object) {
        if (object.toJSON instanceof Function) {
            this.result = object.toJSON();
        }
        else if(object instanceof Array) {
            this.result = object.map((o) => o.toJSON());
        }
        else {
            this.result = object;
        }
    }
    redirect(url) {
        this.result = url;
    }
}

module.exports = FakeResponse;
class ModelBuilder {
    constructor(TargetClass) {
        this.TargetClass = TargetClass;
    }
    build() {
        let target = new this.TargetClass();
        delete this['TargetClass'];
        for(let property in this) {
            target[property] = this[property];
        }
        return target;
    }
}

module.exports = ModelBuilder;
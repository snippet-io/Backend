const setValue = Symbol('setValue');
const none_symbol = Symbol('none');
class Option {
    [setValue](value) {
        this.value = value;
    }
    static some(value) {
        const option = new Option;
        option[setValue](value);
        return option;
    }

    isPresent() {
        return this.value !== none_symbol;
    }
    orElse(sub) {
        return this.isPresent()? this.value : sub;
    }
    orElseGet(callback) {
        return this.isPresent()? this.value : callback();
    }
    orElseThrow(err) {
        if(this.isPresent())
            return this.value;
        else 
            throw err;
    }
}

const none = new Option;
none[setValue](none_symbol);
Option.none = none;

Object.freeze(Option);

module.exports = Option;
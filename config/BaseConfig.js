class BaseConfig {

    constructor() {
        this.MAXLISTENERS = -1;
        this.LISTENERS = {}
    }

    newListener(name, args) {
        this.LISTENERS[name] = {
            arguments: args
        };
    }

    on(name, callback) {
        if (this.LISTENERS[name]) {
            callback(this.LISTENERS[name].arguments);
        }
    }

}

module.exports = BaseConfig;
const BaseConfig = require("./config/BaseConfig");
const fs = require('fs');

class ConfiguratorArray {
    /**
     * 
     * @param {any[]} array 
     */
    constructor(array) {
        this.ARRAY = array;
    }

    set(value) {
        this.ARRAY.push(value);
        return this;
    }

    get(key) {
        if (this.has(key)) {
            return this.ARRAY[key];
        } else {
            return null;
        }
    }

    has(key) {
        if (this.ARRAY[key] != null) {
            return true;
        } else {
            return false;
        }
    }

    remove(key) {
        if (this.has(key)) {
            delete this.ARRAY[key];
            return this;
        } else {
            return null;
        }
    }
}

class ConfiguratorDictionary {
    constructor(dictionary) {
        this.DICTIONARY = dictionary;
    }

    set(key, value) {
        this.DICTIONARY[key] = value;
        return this;
    }

    get(key) {
        if (this.has(key)) {
            return this.DICTIONARY[key];
        } else {
            return null;
        }
    }

    has(key) {
        if (this.DICTIONARY[key] != null) {
            return true;
        } else {
            return false;
        }
    }

    remove(key) {
        if (this.has(key)) {
            delete this.DICTIONARY[key];
            return this;
        } else {
            return null;
        }
    }
}

class ConfiguratorFile {
    constructor(fn, items) {
        this.ITEMS = JSON.parse(items);
        this.fn = fn;
    }

    set(key, value) {
        this.ITEMS[key] = value;
        return this;
    }

    get(key) {
        if (this.has(key)) {
            return this.ITEMS[key];
        } else {
            return null;
        }
    }

    getArray(arrayName) {
        if (this.has(arrayName)) {
            return new ConfiguratorArray(this.ITEMS[arrayName]);
        } else {
            return null;
        }
    }

    getDictionary(dictionaryName) {
        if (this.has(dictionaryName)) {
            return new ConfiguratorDictionary(this.ITEMS[dictionaryName]);
        } else {
            return null;
        }
    }

    has(key) {
        if (this.ITEMS[key] != null) {
            return true;
        } else {
            return false;
        }
    }

    remove(key) {
        if (this.has(key)) {
            delete this.ITEMS[key];
            return true;
        } else {
            return null;
        }
    }

    save() {
        fs.writeFileSync(this.fn, JSON.stringify(this.ITEMS));
        return this;
    }
}

class Configurator extends BaseConfig {

    constructor(file) {
        super();
        this.FILE = file;
    }

    load() {
        return new ConfiguratorFile(this.FILE, fs.readFileSync(this.FILE));
    }

    createNew() {
        return new ConfiguratorFile(this.FILE, "{}");
    }
}

module.exports = Configurator;
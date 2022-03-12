const fsx = require('fs');
const fsxs = require("fs-extra")

const bu = require("boolean-utils")

module.exports = {
    /**
     * Parse a boolean from string
     */
    parseBoolean(str) {
        return bu.parseBoolean(str)
    },

    FileSystem() {
        return {
            readFile(file) {
                return fsx.readFileSync(file);
            },

            mkdir(name) {
                fsx.mkdirSync(name);
            },

            rmdir(name) {
                fsx.rmdirSync(name);
            },

            emptyDir(name) {
                fsxs.emptyDirSync(name);
            },
            
            writeFile(name, data) {
                fsx.writeFileSync(name, data)
            },

            exist(name) {
                return fsx.existsSync(name)
            }
        }
    }
}
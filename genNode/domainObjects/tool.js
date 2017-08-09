const toolsKind = require('../domainObjects/toolsKind');

module.exports = class Tool {
    /**
     * 
     * @param {String} code 
     * @param {toolsKind} type 
     */
    constructor(code, type){
        this.code = code;
        this.type = type;
    }
};
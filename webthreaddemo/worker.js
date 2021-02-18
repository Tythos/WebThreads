/**
 * 
 */

importScripts("WebThread-v1.0.0.js");

define(function(require, exports, module) {
    exports.onMessage = function(x, y) {
        console.log("Message received from main script");
        let workerResult = `Result: ${x * y}`;
        console.log("Posting message back to main script");
        return workerResult;
    };

    return Object.assign(exports, {
        "__url__": "",
        "__semver__": "",
        "__license__": ""
    });
});

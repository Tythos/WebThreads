/**
 * @author "Brian Kirkpatrick" <code@tythos.net>
 */

define(function(require, exports, module) {
    exports.load = function(name, req, onload, config) {
        fetch(name)
            .then(response => response.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, {}))
            .then(instantiation => onload(instantiation.instance));
    };

    return Object.assign(exports, {
        "__url__": "",
        "__license__": "MIT",
        "__semver__": "1.0.0"
    });
});

/**
 * @author "Brian Kirkpatrick" <code@tythos.net>
 */

require.config({
    "paths": {
        "wasm": "wasmloader"
    }
});

require(["wasm!hello_wasm_standalone_bg.wasm"], function(wasm) {
    let n = 32;
    let div = window.document.createElement("div");
    let square = wasm.exports.square;
    div.textContent = `> ${n} squared is ${square(n)}`;
    window.document.body.appendChild(div);
    window.mywasm = wasm;
});

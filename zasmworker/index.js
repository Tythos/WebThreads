/**
 * 
 */

require(["WasmThread"], function(WasmThread) {
    function onWasmReturned(event) {
        console.log(`WasmThread call returned: ${event}`);
    }

    let wt = new WasmThread("hello_wasm_standalone_bg.wasm");
    wt.call("square", [1.2], onWasmReturned);
});

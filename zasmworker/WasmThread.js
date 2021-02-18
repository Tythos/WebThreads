/**
 * @author "Brian Kirkpatrick" <code@tythos.net>
 */

if (typeof define == "undefined") {
    // evaluated within worker context ("child" thread)
    let wasmInstance = null;

    function loadWasmModule(wasmPath) {
        fetch(wasmPath)
            .then(response => response.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, {}))
            .then(instantiation => { wasmInstance = instantiation.instance; });
    }
    
    function onmessage(event) {
        let message = event.data;
        console.log(message);
        switch (message.type) {
            case "WASM_RESOLVED":
                loadWasmModule(message.wasmPath);
                break;
            case "CALL_INVOKED":
                break;
            default:
                break;
        }
    }
} else {
    // evaluated within window context ("main" thread)
    define(function(require, exports, module) {
        class WasmThread {
            constructor(wasmPath) {
                this.wasmPath = wasmPath;
                this.worker = new Worker(module.uri);
                this.worker.onerror = this.onWorkerError.bind(this);
                this.worker.onmessage = this.onWorkerMessage.bind(this);
                this.worker.onmessageerror = this.onWorkerMessageerror.bind(this);
                this.calls = {};

                // initialize child thread with postMessage() call that passes wasm module instance
                this.worker.postMessage({
                    "type": "WASM_RESOLVED",
                    "id": 0,
                    "wasmPath": wasmPath
                });
            }

            onWorkerError(event) {
                console.error(event);
            }

            onWorkerInitialized(event) {
                console.log(event);
            }

            onWorkerMessage(event) {
                let id = event.data[0];
                if (!id) {
                    this.onWorkerInitialized(event.data[1]);
                    return;
                }
                let result = event.data[1];
                //this.calls[id](result);
                console.log(this.calls);
                //delete this.calls[id];
            }

            onWorkerMessageerror(event) {
                console.error(event);
            }

            call(fname, args, callback) {
                let id = (Math.floor(Math.random() * Math.pow(2, 32))).toString(16);
                while (this.calls.hasOwnProperty(id)) {
                    id = (Math.floor(Math.random() * Math.pow(2, 32))).toString(16);
                }
                this.calls[id] = callback;
                this.worker.postMessage({
                    "type": "CALL_INVOKED",
                    "id": id,
                    "fname": fname,
                    "args": args
                });
            }

            close() {
                this.worker.terminate();
            }
        }

        return Object.assign(WasmThread, {
            "__url__": "",
            "__semver__": "",
            "__license__": ""
        });
    });
}

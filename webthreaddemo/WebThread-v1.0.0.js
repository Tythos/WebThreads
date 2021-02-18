/* Single-file JavaScript module that defines a developer-friendly interface
   for adapting, and calling, AMD-compatible modules in a threaded manner using
   WebWorkers. There are two components merged within this single file:

   1. The first ("if") block is evaluated by the WebWorker, which should
      include the following line at the beginning of the file:

      > importScripts("WebThread-v1.0.0.js");

      The module in question, which should be single-file (dependency-free),
      should then attach an "onMessage()" method to its exports object. That
      method will be invoked by client-side calls to the WebThread instance.

   2. The second ("else") block is a normal AMD-compatible module that defines
      a WebThread class for the front end to use. A WebThread object is
      instantiated with the path to the module defined as a worker (above).
      Once instantiated, the "send()" method can be used to pass arguments that
      are packaged/unpackaged and managed to ensure uniqueness. The second
      parameter of "send()" is a callback that will be invoked when the worker
      finishes that particular evaluation.

   Key advantages of this approach, which effectively wrapps the (Web)Worker
   interface with a managed call-and-callback infrastructure on both ends,
   include:

   * Agnostic development/adaptation of the worker module within a traditional,
     AMD-compatible closure.

   * Instantiate-once, call-many-times behavior without directly interacting
     with (Web)Worker message handling/unpacking.

   * Backwards-compatible asynchronous calls to computationally-heavy (e.g.,
     satellite propagation) routines that can be encapsulated within a single
     module, which splices nicely with typical callback-based asynch code.

   This produces a very elegant interface for the caller/client:

     > let wt = new WebThread("path/to/worker/module.js");
     > wt.send([arg1, arg2], callbackA);
     > wt.send([arg3, arg4], callbackB);
*/

if (typeof define == "undefined") {
    // should only be evaluated within WebWorker    
    define = function(handler) {
        let require = function() { console.error("WorkerBase requires standalone modules w/o dependencies"); };
        let exports = {};
        let module = { "exports": exports };

        handler(require, exports, module);
        postMessage([null, "worker initialized"]);
        onmessage = function(event) {
            // result of exports.onMessage will be posted as message to parent
            let id = event.data[0];
            let args = event.data[1];
            let result = exports.onMessage.apply(null, args);
            postMessage([id, result]);
        };
    };
} else {
    // should only be evaluated in client
    define(function(require, exports, module) {
        class WebThread {
            constructor(target, args) {
                this.target = target; // path to worker script
                this.args = args;
                this.worker = new Worker(this.target);
                this.worker.onerror = this.onWorkerError.bind(this);
                this.worker.onmessage = this.onWorkerMessage.bind(this);
                this.worker.onmessageerror = this.onWorkerMessageerror.bind(this);
                this.calls = {};
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
                this.calls[id](result);
                console.log(this.calls);
                delete this.calls[id];
            }

            onWorkerMessageerror(event) {
                console.error(event);
            }

            send(args, callback) {
                let id = (Math.floor(Math.random() * Math.pow(2, 32))).toString(16);
                while (this.calls.hasOwnProperty(id)) {
                    id = (Math.floor(Math.random() * Math.pow(2, 32))).toString(16);
                }
                this.calls[id] = callback;
                this.worker.postMessage([id, args]);
            }

            close() {
                this.worker.terminate();
            }
        }

        return WebThread;
    });
}

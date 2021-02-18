/**
 * 
 */

require(["WebThread-v1.0.0"], function(WebThread) {
    function onCallbackOne(event) {
        console.log(`Message one received from worker:`);
        console.log(event);
    }

    function onCallbackTwo(event) {
        console.log(`Message two received from worker:`);
        console.log(event);
    }

    window.myWebThread = new WebThread("worker.js");
    window.myWebThread.send([1.1, 2.2], onCallbackOne);
    window.myWebThread.send([3.3, 4.4], onCallbackTwo);
});

/**
 * 
 */

onmessage = function(event) {
    console.log("Message received from main script");
    let workerResult = `Result: ${event.data[0] * event.data[1]}`;
    console.log("Posting message back to main script");
    postMessage(workerResult);
}

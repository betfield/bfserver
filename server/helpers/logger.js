/*
Usage:

        logger.log("first log from meteor", "custom_tag");
        logger.info("it will store this message with info tag");
        logger.error(JSErrorObject);
        logger.data("some message", JSONObject);

*/

const logger = {
    tag: (message, tag) => {
        try {
            console.log("[" + tag + "]: " + message);
            Logger.log(message, tag);
        } catch (err) {
            console.log("Error sending info to Loggly: " + err.message);
            console.log(err.stack);
        }
    },
    error: (message, err) => {
        try {
            console.log("[error]: " + message + ": " + err.message);
            console.log("[error]: " + err.stack);
            Logger.error({
                "error": err.message,
                "trace": err.stack
            });
            Logger.trace(err.stack);
        } catch (err) {
            console.log("Error sending info to Loggly: " + err.message);
            console.log(err.stack);
        }
    },
    info: (message) => {
        try {
            console.log("[info]: " + message);
            Logger.info(message);
        } catch (err) {
            console.log("Error sending info to Loggly: " + err.message);
            console.log(err.stack);
        }
    },
    data: (message, obj) => {
        try {
            console.log("[data]: " + message);
            Logger.trace({
                "message": message, 
                "object": obj
            });
        } catch (err) {
            console.log("Error sending info to Loggly: " + err.message);
            console.log(err.stack);
        }
    },
}

export { logger }
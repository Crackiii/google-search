import app from "./app";


/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "The wow is running at %d in %s mode",
        app.get("port"),
        app.get("env")
    );
});

export default server;
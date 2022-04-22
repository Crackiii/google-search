import errorHandler from "errorhandler";
import app from "./app";
import "./services";
import "./jobs";

if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

const server = app.listen(app.get("port"), () => {
    console.log(
        "The wow is running at %d in %s mode",
        app.get("port"),
        app.get("env")
    );
});

export default server;
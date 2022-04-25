import errorHandler from "errorhandler";
import app from "./app";
import "./services";
import "./jobs";

if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

const server = app.listen(app.get("port"), () => {
    console.log(
        "[Trendscads Scrapper Backend]: Running at %d in %s mode. (%s)",
        app.get("port"),
        app.get("env"),
        new Date().toLocaleString()
    );
});

export default server;
import express from "express";
import { getGoogleSearchResultsByQueries, getWebsiteDataByLink } from "./google-search";
import bodyParser from "body-parser";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 8003);

app.use(bodyParser.json());

app.use(function (_, res, next) {

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

  // Pass to next layer of middleware
  next();
});

/**
 * API examples routes.
 */

app.get("/", (_, res) => res.send("WELCOME TO GOOGLE SEARCH APP"));

app.get("/health", (_, res) => res.status(200).send("Health check works"));

app.post("/google-search/queries", async (req, res) => {
  try {
    const data = await getGoogleSearchResultsByQueries(req.body.queries);

    
    if((data).error) {
      res.status(500).send(data);
    }
    res.send(200).send(data);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/google-search/links", async (req, res) => {
  try {
    const data = await getWebsiteDataByLink(req.body.links);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if((data as any).error) {
      res.status(500).send(data);
    }
    res.send(200).send(data);
  } catch (error) {
    console.log(error.message);
  }

});




export default app;
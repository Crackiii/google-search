import express from "express";
import { getGoogleSearchResultsByQueries } from "./google-search";
import bodyParser from "body-parser";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.NODE_ENV || 8003);

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
app.get("/", (req, res) => res.send("WELCOME TO GOOGLE SEARCH APP"));

app.post("/google-search:queries", async (req, res) => {
  const data = await getGoogleSearchResultsByQueries(req.body.queries);

  res.send(data);
});

app.post("/google-search:links", async (req, res) => {
  const data = await getGoogleSearchResultsByQueries(req.body.links);
  res.send(data);
});




export default app;
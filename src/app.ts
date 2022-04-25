import express from "express";
import { websiteHandler } from "./services/website";
const app = express();

app.set("port", process.env.PORT || 3009);
app.use(express.json());

app.use(function (_, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});


app.get("/", (_, res) => res.status(200).send("<h1>Running app</h1>"));
app.get("/health", (_, res) => res.status(200).send("Health check works"));
app.get("/website", websiteHandler);



export default app;
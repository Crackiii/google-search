import * as cron from "node-cron";
import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { getGoogleRealTimeTrendsByCountry } from "../services/google-trends";
import { putGoogleTrends } from "../database/google-trends-realtime";
import _ from "lodash";
import { REDIS_URL } from "../utils/common";

export const realtime_countries = [
  "Argentina - AR",
  "Germany - DE",
  "Australia - AU",
  "Austria - AT",
  "Belgium - BE",
  "Brazil - BR",
  "Canada - CA",
  "Chile - CL",
  "Colombia - CO",
  "France - FR",
  "India - IN",
  "Ireland - IE",
  "Italy - IT",
  "Japan - JP",
  "Malaysia - MY",
  "Mexico - MX",
  "Netherlands - NL",
  "New Zealand - NZ",
  "Norway - NO",
  "Philippines - PH",
  "Poland - PL",
  "Portugal - PT",
  "Russia - RU",
  "Sweden - SE",
  "Switzerland - CH",
  "Turkey - TR",
  "United Kingdom - GB",
  "United States - US",
  "Vietnam - VN",
];


const key = "Google-Realtime";

const jobWorker = async (job: Job) => {
  try {
    if(job.name === "realtime") {
      const countryData = await getGoogleRealTimeTrendsByCountry(job.data.country);
      console.log("[Google Realtime Trends]: Inserting google realtime trends results...");
      for(const category of countryData || []) {
        const categoryName = category.category;
        for(const story of _.reverse(category.stories)) { 
          const relatedQueries = story?.relatedQueries?.map((query: { query: string }) => query.query) || [];
          for(const article of story?.articles || []) {
            await putGoogleTrends({
              title: article.title,
              url: article.url,
              image_url: article.imageUrl,
              time: article.time,
              description: article.description || "-",
              source: article.source,
              category: categoryName?.split("-")?.[1]?.trim(),
              country: job.data.country,
              related_queries: relatedQueries?.join(","),
            });
          }
        }
      }
    }

  } catch(error) {
    console.log(error.message);
  }
};

const googleQueue = new Queue(key, {
  connection: new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null
  }),
});

new Worker(key, jobWorker, {
  connection: new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

const googleQueueEvents = new QueueEvents(key, {
  connection: new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

googleQueueEvents.on("failed", ()  => {
  console.log("[Google Realtime Trends]: Queue job failed");
});

googleQueueEvents.on("completed", () => {
  console.log("[Google Realtime Trends]: Queue job completed");
});

googleQueueEvents.on("error", () => {
  console.log("[Google Realtime Trends]: Queue job error");
});

//schedule a cron job to run every 4 hours
const Job4Hours = cron.schedule("0 */4 * * *", async () => {
  if(await googleQueue.count() > 0) {
    console.log("[Google Realtime Trends]: Worker is busy, returning...");
    return;
  }

  for(const country of realtime_countries) {
    googleQueue.add("realtime", { country: country.split("-")[1].trim() });
  }
});


Job4Hours.start();
// import * as cron from "node-cron";
import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { getGoogleDailyTrendsByCountry } from "../services/google-trends";
import { putGoogleTrends } from "../database/google-trends-daily";
import _ from "lodash";
import { REDIS_URL } from "../utils/common";

export const daily_countries = [
  "Argentina - AR",
  "Germany - DE",
  "Australia - AU",
  "Austria - AT",
  "Belgium - BE",
  "Brazil - BR",
  "Canada - CA",
  "Chile - CL",
  "Colombia - CO",
  "Czechia - CZ",
  "Denmark - DK",
  "Egypt - EG",
  "Finland - FI",
  "France - FR",
  "Greece - GR",
  "Hong Kong - HK",
  "Hungary - HU",
  "India - IN",
  "Indonesia - ID",
  "Ireland - IE",
  "Israel - IL",
  "Italy - IT",
  "Japan - JP",
  "Kenya - KE",
  "Malaysia - MY",
  "Mexico - MX",
  "New Zealand - NZ",
  "Nigeria - NG",
  "Norway - NO",
  "Poland - PL",
  "Portugal - PT",
  "Romania - RO",
  "Saudi Arabia - SA",
  "Singapore - SG",
  "South Africa - ZA",
  "Sweden - SE",
  "Switzerland - CH",
  "Thailand - TH",
  "Turkey - TR",
  "Ukraine - UA",
  "Netherlands - NL",
  "Philippines - PH",
  "Russia - RU",
  "South Korea - KR",
  "Taiwan - TW",
  "United Kingdom - GB",
  "United States - US",
  "Vietnam - VN"
];

const key = "Google-Daily";

const jobWorker = async (job: Job) => {
  try {
    if(job.name === "daily") {
      const countryData = await getGoogleDailyTrendsByCountry(job.data.country);
      const dailyStories = [...(countryData.today || []), ...(countryData.yesterday || [])];
      console.log("[Google Daily Trends]: Inserting google daily trends results...");
      for(const story of dailyStories || []) {
        const relatedQueries = story?.relatedQueries?.map((query: { query: string }) => query.query) || [];
        for(const article of  _.reverse(story?.articles)) {
          await putGoogleTrends({
            title: article.title,
            url: article.url,
            image_url: article.image?.imageUrl || "-",
            time: article.timeAgo,
            description: article.snippet || "",
            source: article.source,
            category: "-",
            country: job.data.country,
            related_queries: relatedQueries?.join(","),
          });
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
  console.log("[Google Daily Trends]: Queue job failed");
});

googleQueueEvents.on("completed", () => {
  console.log("[Google Daily Trends]: Queue job completed");
});

googleQueueEvents.on("error", () => {
  console.log("[Google Daily Trends]: Queue job error");
});

//schedule a cron job to run every day at midday
const JobDaily = async () => {
  if(await googleQueue.count() > 0) {
    console.log("[Google Daily Trends]: Worker is busy, returning...");
    return;
  }

  for(const country of daily_countries) {
    googleQueue.add("daily", { country: country.split("-")[1].trim() });
  }
};

// JobDaily();

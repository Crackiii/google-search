import * as cron from "node-cron";
import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { getGoogleDailyTrendsByCountry, getGoogleRealTimeTrendsByCountry } from "../services/google-trends";
import { putGoogleTrends } from "../database/google-trends";
export const realtime_countries = [
  "Argentina - AR",
  "Australia - AU",
  "Austria - AT",
  "Belgium - BE",
  "Brazil - BR",
  "Canada - CA",
  "Chile - CL",
  "Colombia - CO",
  "France - FR",
  "Germany - DE",
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

export const daily_countries = [
  "Argentina - AR",
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
  "Germany - DE",
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

const key = "Google";

const jobWorker = async (job: Job) => {
  try {
    if(job.name === "realtime") {
      const countryData = await getGoogleRealTimeTrendsByCountry(job.data.country);
      console.log("[Google]: Inserting google realtime trends results...");
      for(const category of countryData || []) {
        const categoryName = category.category;
        for(const story of category.stories) { 
          const relatedQueries = story?.relatedQueries?.map((query: { query: string }) => query.query) || [];
          for(const article of story?.articles || []) {
            await putGoogleTrends({
              title: article.title,
              url: article.url,
              image_url: article.imageUrl,
              time: article.time,
              description: article.description || "",
              source: article.source,
              category: categoryName?.split("-")?.[1]?.trim(),
              country: job.data.country,
              related_queries: relatedQueries?.join(","),
            });
          }
        }
      }
    }

    if(job.name === "daily") {
      const countryData = await getGoogleDailyTrendsByCountry(job.data.country);
      const dailyStories = [...(countryData.today || []), ...(countryData.yesterday || [])];
      console.log("[Google]: Inserting google daily trends results...");
      for(const story of dailyStories || []) {
        const relatedQueries = story?.relatedQueries?.map((query: { query: string }) => query.query) || [];
        for(const article of story?.articles || []) {
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

      console.log({
        country: job.data.country,
        data: countryData,
      });
    }
  } catch(error) {
    console.log(error.message);
  }
};

const googleQueue = new Queue(key, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  }),
});

new Worker(key, jobWorker, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

const googleQueueEvents = new QueueEvents(key, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

googleQueueEvents.on("progress", ()  => {
  console.log("GOOGLE QUEUE JOB PROGRESS");
});

googleQueueEvents.on("failed", ()  => {
  console.log("GOOGLE QUEUE JOB FAILED");
});

googleQueueEvents.on("completed", () => {
  console.log("GOOGLE QUEUE JOB COMPLETED");
});

googleQueueEvents.on("error", () => {
  console.log("GOOGLE QUEUE JOB ERROR");
});

//schedule a cron job to run every 4 hours
const Job4Hours = cron.schedule("*/4 * * * *", async () => {
  if(await googleQueue.count() > 0) {
    console.log("Worker is busy, returning...");
    return;
  }

  for(const country of realtime_countries) {
    googleQueue.add("realtime", { country: country.split("-")[1].trim() });
  }
});

//schedule a cron job to run every day at midday
const JobDaily = cron.schedule("0 0 12 * * *", async () => {
  if(await googleQueue.count() > 0) {
    console.log("Worker is busy, returning...");
    return;
  }

  for(const country of daily_countries) {
    googleQueue.add("daily", { country: country.split("-")[1].trim() });
  }
});

//schedule a cron job to run every second to check the scrapper progress
export const Job1Second = cron.schedule("* * * * * *", async () => {
  if(await googleQueue.count() > 0) {
    console.log("Google worker is busy, returning...");
    return;
  }

  for(const country of realtime_countries) {
    googleQueue.add("realtime", { country: country.split("-")[1].trim() });
  }

  for(const country of daily_countries) {
    googleQueue.add("daily", { country: country.split("-")[1].trim() });
  }
});

Job4Hours.stop();
JobDaily.stop();
Job1Second.stop();

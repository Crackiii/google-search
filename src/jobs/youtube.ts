// import * as cron from "node-cron";
import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { getYoutubeTrendsByCountry } from "../services/youtube";
import { putYoutubeTrends } from "../database/youtube";
import _ from "lodash";
import { REDIS_URL } from "../utils/common";

export const all_countries = [
  "Algeria - DZ",
  "Argentina - AR",
  "Australia - AU",
  "Austria - AT",
  "Azerbaijan - AZ",
  "Bahrain - BH",
  "Bangladesh - BD",
  "Belarus - BY",
  "Belgium - BE",
  "Bosnia and Herzegovina - BA",
  "Brazil - BR",
  "Bulgaria - BG",
  "Canada - CA",
  "Chile - CL",
  "Colombia - CO",
  "Costa Rica - CR",
  "Croatia - HR",
  "Cyprus - CY",
  "Czechia - CZ",
  "Denmark - DK",
  "Ecuador - EC",
  "Egypt - EG",
  "El Salvador - SV",
  "Estonia - EE",
  "Finland - FI",
  "France - FR",
  "Georgia - GE",
  "Germany - DE",
  "Ghana - GH",
  "Greece - GR",
  "Guatemala - GT",
  "Honduras - HN",
  "Hong Kong - HK",
  "Hungary - HU",
  "Iceland - IS",
  "India - IN",
  "Indonesia - ID",
  "Iraq - IQ",
  "Ireland - IE",
  "Israel - IL",
  "Italy - IT",
  "Jamaica - JM",
  "Japan - JP",
  "Jordan - JO",
  "Kazakhstan - KZ",
  "Kenya - KE",
  "Kuwait - KW",
  "Latvia - LV",
  "Lebanon - LB",
  "Libya - LY",
  "Liechtenstein - LI",
  "Lithuania - LT",
  "Luxembourg - LU",
  "Malaysia - MY",
  "Malta - MT",
  "Mexico - MX",
  "Montenegro - ME",
  "Morocco - MA",
  "Nepal - NP",
  "New Zealand - NZ",
  "Nicaragua - NI",
  "Nigeria - NG",
  "Norway - NO",
  "Oman - OM",
  "Pakistan - PK",
  "Panama - PA",
  "Papua New Guinea - PG",
  "Paraguay - PY",
  "Peru - PE",
  "Poland - PL",
  "Portugal - PT",
  "Puerto Rico - PR",
  "Qatar - QA",
  "Romania - RO",
  "Saudi Arabia - SA",
  "Senegal - SN",
  "Serbia - RS",
  "Singapore - SG",
  "Slovakia - SK",
  "Slovenia - SI",
  "South Africa - ZA",
  "Spain - ES",
  "Sri Lanka - LK",
  "Sweden - SE",
  "Switzerland - CH",
  "Thailand - TH",
  "Tunisia - TN",
  "Turkey - TR",
  "Uganda - UG",
  "Ukraine - UA",
  "Uruguay - UY",
  "Yemen - YE",
  "Zimbabwe - ZW",
  "Bolivia - BO",
  "Dominican Republic - DO",
  "Netherlands - NL",
  "North Macedonia - MK",
  "Philippines - PH",
  "Russia - RU",
  "South Korea - KR",
  "Taiwan - TW",
  "Tanzania - TZ",
  "United Arab Emirates - AE",
  "United Kingdom - GB",
  "United States - US",
  "Venezuela - VE",
  "Vietnam - VN"
];

const key = "Youtube";

const jobWorker = async (job: Job) => {
  try {
    if(job.name === "daily") {
      const data = await getYoutubeTrendsByCountry(job.data.country);
      console.log("[Youtube]: Inserting youtube results...");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for(const category of data.youtubeData as any[]) {
        const categoryName = category.trend["value"];
        for(const video of _.reverse(category.links)) {
          await putYoutubeTrends({
            channel_name: video.author || "-",
            url: video.link,
            title: video.title || "-",
            thumbnail_sm: video.thumbnails.medium,
            thumbnail_lg: video.thumbnails.original,
            channel_thumbnail: "-",
            category: categoryName,
            country: job.data.country || "-"
          });
        }
      }
  
    }
  } catch(error) {
    console.log("Error worker - Youtube: ", error.message);
  }

};

const youtubeQueue = new Queue(key, {
  connection: new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null
  }),
});

new Worker(key, jobWorker, {
  connection: new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

const youtubeQueueEvents = new QueueEvents(key, {
  connection: new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

youtubeQueueEvents.on("failed", ()  => {
  console.log("[Youtube]: Queue job failed");
});

youtubeQueueEvents.on("completed", () => {
  console.log("[Youtube]: Queue job completed");
});

youtubeQueueEvents.on("error", () => {
  console.log("[Youtube]: Queue job error");
});


//schedule a cron job to run every day at midday
const JobDaily = async () => {
  if(await youtubeQueue.count() > 0) {
    console.log("[Youtube]: Worker is busy, returning...");
    return;
  }

  for(const country of all_countries) {
    youtubeQueue.add("daily", { country: country.split("-")[1].trim() });
  }
};

JobDaily();

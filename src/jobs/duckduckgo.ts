import * as cron from "node-cron";
import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { getDuckDuckGoResultsByCountry } from "../services/duckduckgo";
import { proxies } from "../proxies";
import { putDuckDuckGoTrends } from "../database/duckduckgo";
export const countries = [
   {
        "label": "Germany",
        "id": "de-de",
        iso: "DE",
},
  {
      "label": "Brazil",
      "id": "br-pt",
        iso: "BR",
  },
  {
      "label": "US (English)",
      "id": "us-en",
        iso: "US",
  },
  {
      "label": "All regions",
      "id": "wt-wt",
        iso: "WT",
  },
  {
      "label": "Argentina",
      "id": "ar-es",
        iso: "AR",
  },
  {
      "label": "Australia",
      "id": "au-en",
        iso: "AU",
  },
  {
      "label": "Austria",
      "id": "at-de",
        iso: "AT",
  },
  {
      "label": "Belgium (fr)",
      "id": "be-fr",
        iso: "BE",
  },
  {
      "label": "Belgium (nl)",
      "id": "be-nl",
        iso: "BE",
  },
  {
      "label": "Bulgaria",
      "id": "bg-bg",
        iso: "BG",
  },
  {
      "label": "Canada (en)",
      "id": "ca-en",
        iso: "CA",
  },
  {
      "label": "Canada (fr)",
      "id": "ca-fr",
        iso: "CA",
  },
  {
      "label": "Catalonia",
      "id": "ct-ca",
        iso: "CT",
  },
  {
      "label": "Chile",
      "id": "cl-es",
        iso: "CL",
  },
  {
      "label": "China",
      "id": "cn-zh",
        iso: "CN",
  },
  {
      "label": "Colombia",
      "id": "co-es",
        iso: "CO",
  },
  {
      "label": "Croatia",
      "id": "hr-hr",
        iso: "HR",
  },
  {
      "label": "Czech Republic",
      "id": "cz-cs",
        iso: "CZ",
  },
  {
      "label": "Denmark",
      "id": "dk-da",
        iso: "DK",
  },
  {
      "label": "Estonia",
      "id": "ee-et",
        iso: "EE",
  },
  {
      "label": "Finland",
      "id": "fi-fi",
        iso: "FI",
  },
  {
      "label": "France",
      "id": "fr-fr",
        iso: "FR",
  },
  {
      "label": "Greece",
      "id": "gr-el",
        iso: "GR",
  },
  {
      "label": "Hong Kong",
      "id": "hk-tzh",
        iso: "HK",
  },
  {
      "label": "Hungary",
      "id": "hu-hu",
        iso: "HU",
  },
  {
      "label": "India (en)",
      "id": "in-en",
        iso: "IN",
  },
  {
      "label": "Indonesia (en)",
      "id": "id-en",
        iso: "ID",
  },
  {
      "label": "Ireland",
      "id": "ie-en",
        iso: "IE",
  },
  {
      "label": "Israel",
      "id": "il-en",
        iso: "IL",
  },
  {
      "label": "Italy",
      "id": "it-it",
    iso: "IT",
  },
  {
      "label": "Japan",
      "id": "jp-jp",
    iso: "JP",
  },
  {
      "label": "Korea",
      "id": "kr-kr",
    iso: "KR",
  },
  {
      "label": "Latvia",
      "id": "lv-lv",
    iso: "LV",
  },
  {
      "label": "Lithuania",
      "id": "lt-lt",
    iso: "LT",
  },
  {
      "label": "Malaysia (en)",
      "id": "my-en",
    iso: "MY",
  },
  {
      "label": "Mexico",
      "id": "mx-es",
    iso: "MX",
  },
  {
      "label": "Netherlands",
      "id": "nl-nl",
    iso: "NL",
  },
  {
      "label": "New Zealand",
      "id": "nz-en",
    iso: "NZ",
  },
  {
      "label": "Norway",
      "id": "no-no",
    iso: "NO",
  },
  {
      "label": "Pakistan (en)",
      "id": "pk-en",
    iso: "PK",
  },
  {
      "label": "Peru",
      "id": "pe-es",
    iso: "PE",
  },
  {
      "label": "Philippines (en)",
      "id": "ph-en",
    iso: "PH",
  },
  {
      "label": "Poland",
      "id": "pl-pl",
    iso: "PL",
  },
  {
      "label": "Portugal",
      "id": "pt-pt",
    iso: "PT",
  },
  {
      "label": "Romania",
      "id": "ro-ro",
    iso: "RO",
  },
  {
      "label": "Russia",
      "id": "ru-ru"
  },
  {
      "label": "Saudi Arabia",
      "id": "xa-ar",
    iso: "XA",
  },
  {
      "label": "Singapore",
      "id": "sg-en",
    iso: "SG",
  },
  {
      "label": "Slovakia",
      "id": "sk-sk",
    iso: "SK",
  },
  {
      "label": "Slovenia",
      "id": "sl-sl",
    iso: "SL",
  },
  {
      "label": "South Africa",
      "id": "za-en",
    iso: "ZA",
  },
  {
      "label": "Spain (ca)",
      "id": "es-ca",
    iso: "ES",
  },
  {
      "label": "Spain (es)",
      "id": "es-es",
    iso: "ES",
  },
  {
      "label": "Sweden",
      "id": "se-sv",
    iso: "SE",
  },
  {
      "label": "Switzerland (de)",
      "id": "ch-de",
    iso: "CH",
  },
  {
      "label": "Switzerland (fr)",
      "id": "ch-fr",
    iso: "CH",
  },
  {
      "label": "Taiwan",
      "id": "tw-tzh",
    iso: "TW",
  },
  {
      "label": "Thailand (en)",
      "id": "th-en",
    iso: "TH",
  },
  {
      "label": "Turkey",
      "id": "tr-tr",
    iso: "TR",
  },
  {
      "label": "US (Spanish)",
      "id": "us-es",
    iso: "US",
  },
  {
      "label": "Ukraine",
      "id": "ua-uk",
    iso: "UA",
  },
  {
      "label": "United Kingdom",
      "id": "uk-en",
    iso: "UK",
  },
  {
      "label": "Vietnam (en)",
      "id": "vn-en",
    iso: "VN",
  }
];


const key = "DuckDuckGo";

const jobWorker = async (job: Job) => {
    try {
        if(job.name === "realtime") {
            
            const proxyhost = proxies[Math.floor(Math.random() * proxies.length)];
            const results = await getDuckDuckGoResultsByCountry(job.data.country, proxyhost);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for(const category of results as any[]) {
                const categoryName = category["category"];
                for(const article of category.data) {
                    await putDuckDuckGoTrends({
                        title: article.title,
                        description: article.description || article.excerpt,
                        url: article.url || article.link,
                        image_url: article.image || "-", 
                        time: article.relative_time || "-",
                        source: article.source || "-",
                        category: categoryName,
                        country: job.data.iso,
                    });
                }
            }
        }
    } catch (error) {
        console.log("Error DuckDuckGo - worker: ", error.message);
    }
};

const duckQueue = new Queue(key, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  }),
});

new Worker(key, jobWorker, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

const duckQueueEvents = new QueueEvents(key, {
  connection: new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  })
});

duckQueueEvents.on("progress", ()  => {
  console.log("DUCK QUEUE JOB PROGRESS");
});

duckQueueEvents.on("failed", ()  => {
  console.log("DUCK QUEUE JOB FAILED");
});

duckQueueEvents.on("completed", () => {
  console.log("DUCK QUEUE JOB COMPLETED");
});

duckQueueEvents.on("error", () => {
  console.log("DUCK QUEUE JOB ERROR");
});

//schedule a cron job to run every 4 hours
const Job4Hours = cron.schedule("*/4 * * * *", async () => {
  if(await duckQueue.count() > 0) {
    console.log("Worker is busy, returning...");
    return;
  }

  for(const country of countries) {
    duckQueue.add("realtime", { country: country.id });
  }
});

//schedule a cron job to run every second to check the scrapper progress
const Job1Second = cron.schedule("* * * * * *", async () => {
  if(await duckQueue.count() > 0) {
    console.log("Duckduckgo is busy, returning...");
    return;
  }

  for(const country of countries) {
    duckQueue.add("realtime", { country: country.id, code: country.iso });
  }
});

Job4Hours.stop();
Job1Second.stop();

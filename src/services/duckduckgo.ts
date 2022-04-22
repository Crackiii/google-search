import axios from "axios-https-proxy-fix";
import { Cluster } from "puppeteer-cluster";
import { getProxy, getRandomUserAgent } from "../utils/common";

const categories =  [
  "business",
  "sports",
  "entertainment",
  "health",
  "technology",
  "news",
  "trending",
  "fashion",
  "travel",
  "food",
  "culture",
  "cryptocurrency",
  "learning",
  "gaming",
  "live",
  "jobs",
  "shopping"
];

export const getDuckDuckGoSearchResults = async (category: string, country: string) => {
  try {

    const proxy = getProxy();
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 50,
      monitor: false,
      timeout: 60000,
      puppeteerOptions: {
        args: [
          "--lang=en-US",
          "--window-size=1920,1080",
          "proxy-server=" + proxy,
        ],
        defaultViewport: null,
        headless: true,
      }
    });

    const searchResults: unknown[] = [];
    const errors: string[] = [];

    cluster.on("taskerror", (err) => {
      errors.push(`Error in getDuckDuckGoSearchResults() - ${err.message}`);
    });

    await cluster.task(async ({ page, data: query }) => {

      const agent = getRandomUserAgent();
      await page.setUserAgent(agent);
      await page.authenticate({ username: "nadeemahmad", password: "Ndim2229" });
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US"
      });
      await page.goto(`https://duckduckgo.com/?q=${query}&l=${country}&ia=web`);
      await page.waitForSelector("#links", { visible: true, timeout: 30000 });

      // Collect all the links
      const data = await page.evaluate(() => {
        const parent = document.getElementById("links");
        const data = Array.from(parent.querySelectorAll(".result")).map(child => ({
            title: child.querySelector("h2")?.textContent?.trim(),
            link: child.querySelector("a")?.getAttribute("href"),
            breadcrumb: child.querySelector(".result__extras")?.textContent.trim(),
            description: child.querySelector(".result__snippet")?.textContent.trim()
        })).filter(c => c.description);

        return data;
      });

      searchResults.push(data);
      await page.close();
    });

    cluster.queue(category);

    await cluster.idle();
    await cluster.close();

    return  searchResults[0];
  
  } catch (error) {
    return new Error(`Error in getDuckDuckGoSearchResults(): ${error.message}`);
  }
};


const getVQD = async (query: string, country: string, host: string) => {
  const vqd = await axios.get(`https://duckduckgo.com/?q=${query}&l=${country}&ia=web`, {
    proxy: {
      host,
      port: 7777,
      auth: {
        username: "nadeemahmad",
        password: "Ndim2229",
      }
    }
  }).then(res => {
    return res.data.match(/vqd=([0-9]+-[0-9]+-[0-9]+)/gm)[0].split("=")[1];
  });

  return vqd;
};

export const getDuckDuckGoNewsResults = async (query: string, country: string, host: string) => {
  const vqd = await getVQD(query, country, host);
  const data = await axios.get(`https://duckduckgo.com/news.js?l=us-en&o=json&q=${query}&l=${country}&vqd=${vqd}`, {
    proxy: {
      host,
      port: 7777,
      auth: {
        username: "nadeemahmad",
        password: "Ndim2229",
      }
    }
  });

  return data.data.results;
};

export const getDuckDuckGoVideosResults = async (query: string, country: string, host: string) => {
  const vqd = await getVQD(query, country, host);
  const data = await axios.get(`https://duckduckgo.com/v.js?l=us-en&o=json&q=${query}&l=${country}&vqd=${vqd}`, {
    proxy: {
      host,
      port: 7777,
      auth: {
        username: "nadeemahmad",
        password: "Ndim2229",
      }
    }
  });

  return data.data.results;
};

export const getDuckDuckGoProductsResults = async (query: string, country: string, host: string) => {
  const vqd = await getVQD(query, country, host);
  const data = await axios.get(`https://duckduckgo.com/m.js?shopping=1&l=us-en&o=json&q=${query}&l=${country}&vqd=${vqd}`, {
    proxy: {
      host,
      port: 7777,
      auth: {
        username: "nadeemahmad",
        password: "Ndim2229",
      }
    }
  });

  return data.data.results;
};


export const getDuckDuckGoResultsByCountry = async (country: string, host: string) => {
  try {
    const searchResults: unknown[] = [];
    for(const category of categories) {
      console.log("Getting DuckDuckGo results by category...", category);
      const data = await Promise.all([
        getDuckDuckGoSearchResults(category, country),
        getDuckDuckGoNewsResults(category, country, host),
      ]).catch(error => console.log(error.message));

      searchResults.push({data: (data as unknown[]).flatMap(a => a), category});
    }

    return searchResults;
  } catch(error) {
    console.log(error.message);
  }
};
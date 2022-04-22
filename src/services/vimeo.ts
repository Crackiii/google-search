import { Cluster } from "puppeteer-cluster";
import { getProxy, getRandomUserAgent } from "../utils/common";

const categories = [
  {
    name: "Sports",
    channel: "https://vimeo.com/categories/sports"
  },
  {
    name: "Earthday",
    channel: "https://vimeo.com/channels/earthdayeveryday"
  },
  {
    name: "Travel",
    channel: "https://vimeo.com/categories/travel"
  },
  {
    name: "health",
    channel: "https://vimeo.com/channels/covid19stories"
  }
];

export const getVimeoVideosByCategories = async () => {
  try {

    const proxy = getProxy();
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 50,
      monitor: true,
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

    const searchResults: Record<string, unknown>[] = [];
    const errors: string[] = [];

    cluster.on("taskerror", (err) => {
      errors.push(`Error in getVimeoVideosByCategories() - ${err.message}`);
    });

    await cluster.task(async ({ page, data: url }) => {


      const agent = getRandomUserAgent();
      await page.setUserAgent(agent);
      await page.authenticate({ username: "nadeemahmad", password: "Ndim2229" });
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US"
      });
      await page.goto(url);
      await page.waitForSelector(".explore_module ", { visible: true, timeout: 30000 });

      // Collect all the links
      const data = await page.evaluate(() => {
       const videos = Array.from(document.querySelectorAll(".explore_module"))
        .filter(module => !module.className.includes("explore_module-hero"))
        .map(module => [...module.querySelectorAll(".iris_p_infinite__item")])
        .flatMap(a => a)
        .map(video => ({
          title: video.querySelector("a h5")?.textContent,
          image: video.querySelector("a img")?.getAttribute("src"),
          link: video.querySelector("a")?.getAttribute("href")
        }))
        .filter(video => video.title);

        return videos;
      });

      searchResults.push({ links: JSON.stringify(data), url });
      await page.close();
    });

    for (const category of categories) cluster.queue(category.channel);

    await cluster.idle();
    await cluster.close();
    return { searchResults, errors };
  
  } catch (error) {
    return new Error(`Error in getVimeoVideosByCategories(): ${error.message}`);
  }
};

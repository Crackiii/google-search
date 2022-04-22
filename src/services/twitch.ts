import { Cluster } from "puppeteer-cluster";
import { getProxy, getRandomUserAgent } from "../utils/common";

export const directories = [
  {
    name: "All live",
    channel: "https://www.twitch.tv/directory/all",
    selector: "article[data-a-target]",
  },
  {
    name: "Home page", 
    channel: "https://www.twitch.tv/",
    selector: "article"
  },
  {
    name: "Live games",
    channel: "https://www.twitch.tv/directory/gaming",
    selector: "article[data-a-target=\"shelf-card\"]"
  }
];


export const getTwitchHomePageData = async () => {
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

    const twitchResults: Record<string, unknown>[] = [];
    const errors: string[] = [];

    cluster.on("taskerror", (err) => {
      errors.push(`Error in getTwitchHomePageData() - ${err.message}`);
    });

    await cluster.task(async ({ page, data: directory }) => {

      const agent = getRandomUserAgent();
      await page.setUserAgent(agent);
      await page.authenticate({ username: "nadeemahmad", password: "Ndim2229" });
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US"
      });
      await page.goto(directory.channel);

      await page.waitForSelector("article", { visible: true, timeout: 30000 });

      await page.evaluate(() => {
        Array.from(document.querySelectorAll("button"))?.filter(button => /show/gmi.test(button?.innerText))?.forEach(btn => btn?.click());
      });

      // Collect all the links
      const data = await page.evaluate((selector: string) => {
        const data = [...document.querySelectorAll(selector)].map(article => {
          return {
            image: article.children[1].querySelector("a img").getAttribute("src"),
            user_link: article.querySelector("a").getAttribute("href"),
            title: article.querySelector("a").textContent,
            game: article.querySelector("a[data-test-selector=\"GameLink\"]")?.textContent,
            game_link: article.querySelector("a[data-test-selector=\"GameLink\"]")?.getAttribute("href"),
          };
        });

        return data;
      }, directory.selector);

      twitchResults.push({ links: JSON.stringify(data), directory });
      await page.close();
    });

    for (const directory of directories) cluster.queue(directory);

    await cluster.idle();
    await cluster.close();
    return { twitchResults, errors };
  
  } catch (error) {
    return new Error(`Error in getTwitchHomePageData(): ${error.message}`);
  }
};

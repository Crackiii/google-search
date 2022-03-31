/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cluster } from "puppeteer-cluster";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { Page } from "puppeteer";


const proxies = [
  "165.231.37.254:7777",
  "165.231.37.98:7777  ",
  "185.104.218.48:7777 ",
  "185.104.219.37:7777 ",
  "196.245.244.231:7777 "
];

export const getGoogleSearchResultsByQueries = async (queries: string[]) => {
  try {
  const proxy = proxies[Math.floor(Math.random() * proxies.length)];
  
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 50,
    monitor: false,
    timeout: 60000,
    puppeteerOptions: {
      args: [
        "--lang=en-US",
        "--window-size=1920,1080",
        `--proxy-server=${proxy}`,
        "--no-sandbox",
      ],
      defaultViewport: null,
      headless: true,
    }
  });


    const queriesData: any = [];
    const errors: any = [];

    cluster.on("taskerror", (err) => {
      errors.push(`Error in getGoogleSearchResultsByQueries() - ${err.message}`);
    });

    await cluster.task(async ({ page, data: query }) => {

      if (!Boolean(query.length)) return [{ links: [], query }];

      await page.authenticate({ username: "nadeemahmad", password: "Ndim2229" });

      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US"
      });

      await page.goto(`https://google.com/search?q=${query}`);

      await page.screenshot({ path: "search.png" });

      // Wait for search results container to be available
      try {
        await page.waitForSelector("#search", { visible: true, timeout: 30000 });
      } catch (error) {
        const isTrafficDetected = await page.evaluate(() => {
          return /Our systems have detected unusual traffic from your computer/gim.test(document.body.textContent);
        });
        throw new Error(`Error crawling on query - ${query}: ${isTrafficDetected ? "Our systems have detected unusual traffic from your computer" : error.message} - IP : ${proxy}`);
      }

      // Collect all the links
      const data = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll(".yuRUbf"));
        const data = links.map(link => {
          return {
            link: link.querySelector("a").getAttribute("href"),
            title: link.querySelector("h3").textContent.trim(),
          };
        });

        return data;
      });

      queriesData.push({ links: data, query });
      await page.close();
    });

    for (const query of queries) cluster.queue(query);

    await cluster.idle();
    await cluster.close();
    clearInterval(interval);
    return {queriesData, errors};
  } catch (error) {
    return new Error(`Error in getGoogleSearchResultsByQueries(): ${error.message}`);
  }
};


export const getWebsiteDataByLink = async (links: string[]) => {
  try {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 50,
    monitor: false,
    timeout: 30000,
    puppeteerOptions: {
      headless: true,
      defaultViewport: null,
      args: [
        "--lang=en-US",
        "--window-size=1920,1080",
        "--no-sandbox",
      ]
    }
  });

  
    const websiteData: any[] = [];
    const errors: any[] = [];

    cluster.on("taskerror", (err, data) => {
      errors.push(`Error in getWebsiteDataByLink() - ${data}: ${err.message}`);
    });

    await cluster.task(async ({ page, data: url }) => {
      if (!Boolean(url)) return;

      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US"
      });

      await page.goto(url, { waitUntil: "load", timeout: 0 });

      const type = websiteType(url);

      if (type === "youtube") {
        const data = await evaluateYoutubeData(page);

        websiteData.push(data);
      }

      if (type === "general") {
        const data = await evaluateGeneralWebsite(page);

        websiteData.push(data);
      }

      if(type === "none") {
        websiteData.push({html: "", short_description: "", metaData: {}});
      }

    });

    for (const url of links) cluster.queue(url);

    await cluster.idle();
    await cluster.close();

    return {websiteData, errors};
  } catch (error) {
    return new Error(`Error in getWebsiteDataByLink(): ${error.message}`);
  }
};

const websiteType = (url: string): "youtube" | "general" | "none" => {
  if (/youtube.com/gmi.test(url)) return "youtube";
  if (/facebook.com/gmi.test(url)) return "none";
  if (/twitter.com/gmi.test(url)) return "none";
  if (/instagram.com/gmi.test(url)) return "none";
  if (/tiktok.com/gmi.test(url)) return "none";

  return "general";
};


const evaluateGeneralWebsite = async (page: Page) => {

  const data = await page.evaluate(() => {
    return document.body.outerHTML;
  });

  const metaData = await getPageMetaData(page);
  await page.close();
  const doc = new JSDOM(data);
  const reader = new Readability(doc.window.document);

  return { html: reader.parse()?.content, short_description: reader.parse()?.excerpt, metaData };
};

const evaluateYoutubeData = async (page: Page) => {
  const data = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll("ytd-compact-video-renderer"));

    const data = videos.map(video => {
      const meta = video.querySelectorAll("a")[1];
      const thumbnail = video.querySelector("img").getAttribute("src");
      const author = meta.querySelector("#channel-name").querySelector("#text-container").textContent.trim();
      const link = meta.getAttribute("href");
      const title = meta.querySelector("h3").textContent.trim();

      return { thumbnail, author, link, title };
    });

    return data;
  });

  const metaData = await getPageMetaData(page);

  return { data, metaData };
};

const getPageMetaData = async (page: Page) => {
  const metaData = await page.evaluate(() => {
    const metas = Array.from(document.querySelectorAll("meta"));

    const title = document.title;

    const getFavicon = () => {
      let favicon = "";
      const nodeList = document.getElementsByTagName("link");
      for (let i = 0; i < nodeList.length; i++) {
        if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
          favicon = nodeList[i].getAttribute("href");
        }
      }
      return favicon;
    };

    const validURL = (str: string) => {
      const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator

      return !!pattern.test(str);
    };

    const url = location.href;

    const allImages = Array.from(document.querySelectorAll("img")).map(img => img.src);

    const favicon = getFavicon();

    const keywords = metas
      .filter(meta => meta?.getAttribute("name") === "keywords")
      .map(meta => meta?.getAttribute("content")).join(",");

    const metaDescription = metas
      .find(meta => meta?.getAttribute("name") === "description")?.getAttribute("content");


    const facebook = metas
      .filter(meta => /og:/gmi.test(meta?.getAttribute("property")))
      .map(meta => ({
        property: meta?.getAttribute("property"),
        content: meta?.getAttribute("content")
      }));

    const twitter = metas
      .filter(meta => /twitter:/gmi.test(meta?.getAttribute("name")))
      .map(meta => ({
        property: meta?.getAttribute("name"),
        content: meta?.getAttribute("content")
      }));

    const images = [...facebook.filter(o => o.property === "og:image" || /image/gmi.test(o.property)),
    ...twitter.filter(o => (o.property === "twitter:image" || /image/gmi.test(o.property)))
    ].map(o => o?.content).filter(validURL);

    const description = [...facebook.filter(o => o.property === "og:description" || /description/gmi.test(o.property)),
    ...twitter.filter(o => (o.property === "twitter:image" || /image/gmi.test(o.property)))
    ].map(o => o?.content);

    return { title, keywords, facebook, twitter, images, description: [...description, metaDescription], favicon, url, allImages };
  });

  return metaData;
};
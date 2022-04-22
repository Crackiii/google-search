import { Cluster } from "puppeteer-cluster";
import { getProxy, getRandomUserAgent } from "../utils/common";

export const youtube_trends = [
  {
    label: "Trending now",
    value: "trending",
    channel: "/feed/trending",
  },
  {
    label: "Sports",
    value: "sports",
    channel: "/channel/UCEgdi0XIXXZ-qJOFPf4JSKw"
  },
  {
    label: "Gaming",
    value: "gaming",
    channel: "/gaming"
  },
  {
    label: "News",
    value: "news",
    channel: "/channel/UCYfdidRxbB8Qhf0Nx7ioOYw"
  },
  {
    label: "Fashion",
    value: "fashion",
    channel: "/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ"
  },
  {
    label: "Learning",
    value: "learning",
    channel: "/channel/UCtFRv9O2AHqOZjjynzrv-xg"
  },
  {
    label: "Popular",
    value: "trending",
    channel: "/channel/UCF0pVplsI8R5kcAqgtoRqoA"
  }
];


export const getYoutubeTrendsByCountry = async (country: string) => {

  try {
    const proxy = getProxy();

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 10,
      monitor: false,
      timeout: 60000,
      puppeteerOptions: {
        args: [
          "--lang=en-US",
          "--window-size=1920,1080",
          `proxy-server=${proxy}`,
        ],
        defaultViewport: null,
        headless: true,
      }
    });

    const youtubeData: Record<string, unknown>[] = [];
    const errors: string[] = [];

    cluster.on("taskerror", (err, job) => {
      errors.push(`Error in getYoutubeTrendsByCountry() - ${err.message} - ${JSON.stringify(job)}`);
    });

    await cluster.task(async ({ page, data: trend }) => {
      console.log("[Youtube]: Getting youtube results for trend -", trend.label);
      const agent = getRandomUserAgent();
      await page.setUserAgent(agent);
      await page.authenticate({ username: "nadeemahmad", password: "Ndim2229" });
      await page.goto(`https://www.youtube.com${trend.channel}?gl=${country}`);

      await page.evaluate(() => {
        Array.from(document.querySelectorAll("button"))?.find(b => b.innerText === "I AGREE")?.click();
      });

      await page.waitForSelector("#contents", { visible: true, timeout: 30000 });

      // Collect all the links
      const data = await page.evaluate(() => {
        // get youtube video id from url
        const getVideoId = (url: string) => {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url?.match(regExp);
          return match && match?.[2]?.length === 11 ? match?.[2] : null;
        };

        //generate thumbnail url from youtube video id
        const getThumbnails = (videoId: string) => {
          return {
            original: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
            small: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
            tiny: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
          };
        };

        const videos = Array.from(document.querySelectorAll("#dismissible"));

        return  videos.map(video => {
          const author = video.querySelector("#channel-name a")?.textContent.trim();
          const link = video.querySelector("a").getAttribute("href");
          const title = video.querySelector("h3")?.textContent.trim();

          return { author, link, title, thumbnails: getThumbnails(getVideoId(link)) };
        });
      });


      youtubeData.push({ links: data, trend });
      await page.close();
    });

    for (const trend of youtube_trends) cluster.queue(trend);
    
    await cluster.idle();
    await cluster.close();

    return {youtubeData, errors};

  } catch(error) {
    throw new Error(`Error in getYoutubeTrendsByCountry(): ${error.message}`);
  }
};

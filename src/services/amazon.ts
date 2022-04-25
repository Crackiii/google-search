import { Cluster } from "puppeteer-cluster";
import { getProxy, getRandomUserAgent } from "../utils/common";

export const best_sellers_categories: string[]= [
  // TODO: add more best sellers categories  
];

export const countries_website = [
  {
    country: "Australia",
    website: "https://www.amazon.com.au/",
    deals: "https://www.amazon.com/gp/goldbox",
    iso: "AU",
  },
  {
    country: "Brazil (Brasil)",
    website: "https://www.amazon.com.br/",
    deals: "https://www.amazon.com.br/deals",
    iso: "BR",
  },
  {
    country: "Canada",
    website: "https://www.amazon.ca/",
    deals: "https://www.amazon.ca/deals",
    iso: "CA",
  },
  {
    country: "China (中国)",
    website: "https://www.amazon.cn/",
    deals: "https://www.amazon.cn/deals",
    iso: "CN",
  },
  {
    country: "Egypt (مصر)",
    website: "https://www.amazon.eg/",
    deals: "https://www.amazon.eg/deals",
    iso: "EG",
  },
  {
    country: "France",
    website: "https://www.amazon.fr/",
    deals: "https://www.amazon.fr/deals",
    iso: "FR",
  },
  {
    country: "Germany (Deutschland)",
    website: "https://www.amazon.de/",
    deals: "https://www.amazon.de/deals",
    iso: "DE",
  },
  {
    country: "India",
    website: "https://www.amazon.in/",
    deals: "https://www.amazon.in/deals",
    iso: "IN",
  },
  {
    country: "Italy (Italia)",
    website: "https://www.amazon.it/",
    deals: "https://www.amazon.it/deals",
    iso: "IT",
  },
  {
    country: "Japan (日本)",
    website: "https://www.amazon.co.jp/",
    deals: "https://www.amazon.co.jp/deals",
    iso: "JP",
  },
  {
    country: "Mexico (México)",
    website: "https://www.amazon.com.mx/",
    deals: "https://www.amazon.com.mx/deals",
    iso: "MX",
  },
  {
    country: "Netherlands (Nederland)",
    website: "https://www.amazon.nl/",
    deals: "https://www.amazon.nl/deals",
    iso: "NL",
  },
  {
    country: "Poland (Polska)",
    website: "https://www.amazon.pl/",
    deals: "https://www.amazon.pl/deals",
    iso: "PL",
  },
  {
    country: "Saudi Arabia (المملكة العربية السعودية)",
    website: "https://www.amazon.sa/",
    deals: "https://www.amazon.sa/deals",
    iso: "SA",
  },
  {
    country: "Singapore",
    website: "https://www.amazon.sg/",
    deals: "https://www.amazon.sg/deals",
    iso: "SG",
  },
  {
    country: "Spain (España)",
    website: "https://www.amazon.es/",
    deals: "https://www.amazon.es/deals",
    iso: "ES",
  },
  {
    country: "Sweden (Sverige)",
    website: "https://www.amazon.se/",
    deals: "https://www.amazon.se/deals",
    iso: "SE",
  },
  {
    country: "Turkey (Türkiye)",
    website: "https://www.amazon.com.tr/",
    deals: "https://www.amazon.com.tr/deals",
    iso: "TR",
  },
  {
    country: "United Arab Emirates",
    website: "https://www.amazon.ae/",
    deals: "https://www.amazon.ae/deals",
    iso: "AE",
  },
  {
    country: "United Kingdom",
    website: "https://www.amazon.co.uk/",
    deals: "https://www.amazon.co.uk/deals",
    iso: "UK",
  },
  {
    country: "United States",
    website: "https://www.amazon.com/",
    deals: "https://www.amazon.com/deals",
    iso: "US",
  }
];

export const getAmazonTopDealsByCountry = async () => {
  try {

    const proxy = getProxy();
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 50,
      monitor: true,
      timeout: 120000,
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

    cluster.on("taskerror", (err, job) => {
      errors.push(`Error in getAmazonTopDealsByCountry() - ${err.message} - ${JSON.stringify(job)}`);
    });

    await cluster.task(async ({ page, data: website }) => {

      const agent = getRandomUserAgent();
      await page.setUserAgent(agent);
      await page.authenticate({ username: "nadeemahmad", password: "Ndim2229" });
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US"
      });
      await page.goto(website.deals);
      await page.screenshot({path: `screenshots/${website.country}_before.png`});
      await page.waitForSelector("div[data-testid=\"deal-card\"]", { visible: true, timeout: 60000 });
      await page.screenshot({path: `screenshots/${website.country}_after.png`});

      // Collect all the links
      const data = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div[data-testid=\"deal-card\"]"))
        .map(product => ({
          link: product.querySelectorAll("a")[0].getAttribute("href"),
          image: product.querySelectorAll("a")[0].querySelector("img").getAttribute("src"),
          deal: product.querySelectorAll("a")[1]?.innerText.trim(),
          title: product.querySelectorAll("a")[2]?.innerText.trim()
        }));
      });

      searchResults.push({ links: JSON.stringify(data), website });
      await page.close();
    });

    for(const website of countries_website) cluster.queue(website);

    await cluster.idle();
    await cluster.close();
    return { searchResults, errors };
  
  } catch (error) {
    return new Error(`Error in getAmazonTopDealsByCountry(): ${error.message}`);
  }
};


import axios from "axios";
const realtime_categories = [
  "b - business", //Business
  "e - entertainment", //Entertainment
  "m - health", //Health,
  "t - technology", //Sci/Tech
  "s - sports", //Sports
  "h - trending", //Top stories
];

const cookieValue = "";
const DEFAULT_LANGUAGE = "en-US";
const DEFAULT_TIMEZONE = "-60";
const DEFAULT_LOCATION = "US";
const DEFAULT_CATEGORY = "all";
const RELATED_QUERIES_ENDPOINT = "/widgetdata/relatedqueries";
const DAILY_TRENDS_ENDPOINT = "/dailytrends";
const REALTIME_TRENDS_ENDPOINT = "/realtimetrends";
const INDIVIDUAL_STORY_ENDPOINT = "/stories";

interface Configs {
  LANGUAGE?: string
  TIMEZONE?: string
  LOCATION?: string
  CATGEORY?: string
  PROPERTY?: string
  TIME_RANGE_TEXT?: "today 1-m" | "today 3-m" | "today 12-m"
}

const getAxiosClient = () => {
  const baseURL = "https://trends.google.com/trends/api";
  const headers = {} as never;

  if (cookieValue) headers["cookie"] = cookieValue;

  const client = axios.create({
    baseURL,
    headers
  });

  return client;
};

const getRealTimeStoryIdsByLink = async (configs?: Configs) => {
  const client = getAxiosClient();

  const URL = [
    REALTIME_TRENDS_ENDPOINT,
    `?hl=${configs?.LANGUAGE || DEFAULT_LANGUAGE}`,
    `&tz=${configs?.TIMEZONE || DEFAULT_TIMEZONE}`,
    `&cat=${configs?.CATGEORY || DEFAULT_CATEGORY}`,
    "&fi=0",
    "&fs=0",
    `&geo=${configs?.LOCATION || DEFAULT_LOCATION}`,
    "&ri=300",
    "&rs=20",
  ].join("");

  const realtimeTrends = await client.get(URL);

  //Get trending story IDS
  const trendingStoriesIDs = JSON.parse(realtimeTrends.data.slice(5)).trendingStoryIds;

  return trendingStoriesIDs;
};


const getStoryDetailById = async (storyId: string, configs?: Configs) => {
  const client = getAxiosClient();

  try {
    const URL = [[INDIVIDUAL_STORY_ENDPOINT, `${storyId}`].join("/"),
  `?hl=${configs?.LANGUAGE ?? DEFAULT_LANGUAGE}`,
  `&tz=${configs?.TIMEZONE ?? DEFAULT_TIMEZONE}`,
  `&id=${storyId}`
  ].join("");

  const storiesSummary = await client.get(URL);

  const [news, , , queries] = JSON.parse(storiesSummary.data.slice(4)).widgets;

  const relatedQueries = await getRelatedQueries(queries.token, queries.request);

  return { articles: news.articles, relatedQueries };
  } catch(error) {}

};


const getRelatedQueries = async (token: string, request: object, configs?: Configs) => {
  const client = getAxiosClient();

  const relatedQueries = await client.post([
    RELATED_QUERIES_ENDPOINT,
    `?hl=${configs?.LANGUAGE || DEFAULT_LANGUAGE}`,
    `&tz=${configs?.TIMEZONE || DEFAULT_TIMEZONE}`,
    "&lq=true",
    `&token=${token}`,
  ].join(""), request);

  return JSON.parse(relatedQueries.data.slice(5)).default.queries;
};

export const getDailyTrends = async (configs?: Configs) => {
  const client = getAxiosClient();
  try{
  const dailyTrends = await client.get([
    DAILY_TRENDS_ENDPOINT,
    `?hl=${configs?.LANGUAGE ?? DEFAULT_LANGUAGE}`,
    `&tz=${configs?.TIMEZONE ?? DEFAULT_TIMEZONE}`,
    `&geo=${configs?.LOCATION ?? DEFAULT_LOCATION}`
  ].join(""));

  const results = JSON.parse(dailyTrends.data.slice(5)).default;

  return {
    today: results.trendingSearchesDays?.[0]?.trendingSearches,
    yesterday: results.trendingSearchesDays?.[1]?.trendingSearches
  };
} catch(error) {
  console.log(error.message);
}
};

//Handler for the realtime trends
export const getGoogleRealTimeTrendsByCountry = async (country: string) => {
  try {
    const allData = [];
    // 1 - Get the story ids
    const categoriesPromises = [];
    for(const category of realtime_categories) {
      console.log("[Google]: Getting google results for category - ", category);
      // get categories codes from the list
      const CATGEORY = category.split(" - ")[0].trim();

      // create promises to get stories ids for all categories in a country
      categoriesPromises.push(getRealTimeStoryIdsByLink({CATGEORY, LOCATION: country}));
    }
    // resolve promises for stories ids
    const storiesIds = await Promise.all(categoriesPromises);

    // 2 - Get the stories details for all the stories ids
    const filteredStoriesIds = storiesIds.map(stories => stories.slice(0, 15));
    
    // create promises to get stories details for all stories ids
    for(const [index, storiesIds] of filteredStoriesIds.entries()) {
      const promises = [];
      for(const id of storiesIds) {
        promises.push(getStoryDetailById(id));
      }
      // resolve promises for stories details
      const data = await Promise.all(promises);

      allData.push({
        category: realtime_categories[index],
        stories: data
      });
    }
    
    return allData;
  } catch(error) {}
};

//Handler for the daily trends
export const getGoogleDailyTrendsByCountry = async (country: string) => {
  console.log("[Google]: Getting google daily trends for country - ", country);
  const data = await getDailyTrends({LOCATION: country});

  return data;
};

import UserAgent from "user-agents";

const proxies_list = [
  "165.231.37.254:7777",
  "165.231.37.98:7777  ",
  "185.104.218.48:7777 ",
  "185.104.219.37:7777 ",
  "196.245.244.231:7777 ",
  "185.121.138.57:7777",
  "163.172.247.140:7777",
  "104.227.255.22:7777",
  "178.17.170.95:7777",
  "165.231.35.99:7777",
  "104.227.253.223:7777",
  "104.227.255.56:7777",
  "165.231.35.27:7777",
  "196.196.160.65:7777",
  "163.172.247.143:7777",
  "165.231.35.66:7777",
  "198.240.91.104:7777",
  "185.121.138.32:7777",
  "185.121.138.101:7777",
  "198.240.90.113:7777",
  "195.140.212.195:7777",
  "195.140.212.134:7777",
  "196.196.160.12:7777",
  "165.231.35.96:7777",
  "196.196.160.27:7777",
];

export const getProxy = () => {
  const proxy = proxies_list[Math.floor(Math.random() * proxies_list.length)];

  return proxy;
};

export const getRandomUserAgent = () => {
  const random = new UserAgent({
    deviceCategory: "desktop",
  });
  return random.random().toString();
};

export const REDIS_URL = process.env.REDIS_URL;
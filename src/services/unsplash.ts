import axios from "axios";

export const topics = [
  {
      "name": "Color of Water",
      "link": "color-of-water"
  },
  {
      "name": "Current Events",
      "link": "current-events"
  },
  {
      "name": "Wallpapers",
      "link": "wallpapers"
  },
  {
      "name": "3D Renders",
      "link": "3d-renders"
  },
  {
      "name": "Textures & Patterns",
      "link": "textures-patterns"
  },
  {
      "name": "Experimental",
      "link": "experimental"
  },
  {
      "name": "Architecture",
      "link": "architecture"
  },
  {
      "name": "Nature",
      "link": "nature"
  },
  {
      "name": "Business & Work",
      "link": "business-work"
  },
  {
      "name": "Fashion",
      "link": "fashion"
  },
  {
      "name": "Film",
      "link": "film"
  },
  {
      "name": "Food & Drink",
      "link": "food-drink"
  },
  {
      "name": "Health & Wellness",
      "link": "health"
  },
  {
      "name": "People",
      "link": "people"
  },
  {
      "name": "Interiors",
      "link": "interiors"
  },
  {
      "name": "Street Photography",
      "link": "street-photography"
  },
  {
      "name": "Travel",
      "link": "travel"
  },
  {
      "name": "Animals",
      "link": "animals"
  },
  {
      "name": "Spirituality",
      "link": "spirituality"
  },
  {
      "name": "Arts & Culture",
      "link": "arts-culture"
  },
  {
      "name": "History",
      "link": "history"
  },
  {
      "name": "Athletics",
      "link": "athletics"
  }
];


export const getUnsplashImagesForAllTopics = async () => {
  const promises = [];
  for(const topic of topics) {
    promises.push(axios.get(`https://unsplash.com/napi/topics/${topic.link}/photos?page=1&per_page=50`));
  }

  const responses = await Promise.all(promises);
  const images = responses.map(res => res.data);
  return images.flatMap(i => i);
};


export const getUnsplashImagesByQuery = async (query: string) => {
  const res = await axios.get(`https://unsplash.com/napi/search?per_page=50&query=${query}&xp=`);
  
  return res.data;
};

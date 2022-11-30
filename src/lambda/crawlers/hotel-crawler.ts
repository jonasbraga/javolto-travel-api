import { getCacheEntry, putCacheEntry } from "../utils/cacheTable";
import { SearchParams } from "../crawler/types";
import { getHotels } from "./functions/fetchMethods";
const baseUrl =
  "https://priceline-com-provider.p.rapidapi.com/v1/hotels/search";

const createSearchString = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.destination.trim().toLowerCase();
  const sanitizedStartDate = searchInput.startDate;
  const sanitizedEndDate = searchInput.endDate;

  return `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}`;
};

/**
 * Continue execution of the crawler in another step function execution
 */
export const hotelCrawl = async () => {
  /*
  const searchString = createSearchString(search);
  // Search in the cache database for the data
  const cachedData = getCacheEntry(searchString);

  // If it's cached, return, otherwise scrap the data
  if (cachedData) {
    return cachedData;
  }
  */

  console.log("running3");
  try {
    const response = (await getHotels(baseUrl)) as any;
    console.log(response.hotels[0]);

    /*
      const parsedData = resultsInput;

      // Store in the database, with search as key and ttl of 3h

      await putCacheEntry(searchString, parsedData);

      return parsedData;

    */
  } catch (error) {
    console.log(error);
  }
};
hotelCrawl();

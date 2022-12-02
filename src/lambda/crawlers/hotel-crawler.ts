import { getCacheEntry, putCacheEntry } from "../utils/cacheTable";
import { SearchParams } from "../crawler/types";
import { getHotels, getBooking } from "./functions/fetchMethods";
import { filterHotels, filterBookings } from "./functions/filterMethods";
import { fixedCityIDs } from "./constants/index";
const createSearchString = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.destination.trim().toLowerCase();
  const sanitizedStartDate = searchInput.startDate;
  const sanitizedEndDate = searchInput.endDate;

  return `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}`;
};

/**
 * Continue execution of the crawler in another step function execution
 */
export const hotelCrawl = async (
  city = "Berlin",
  checkInDate = "2023-04-01",
  checkOutDate = "2023-04-12"
) => {
  /*
  const searchString = createSearchString(search);
  // Search in the cache database for the data
  const cachedData = getCacheEntry(searchString);

  // If it's cached, return, otherwise scrap the data
  if (cachedData) {
    return cachedData;
  }
  */

  try {
    const cityID = fixedCityIDs[city];
    const promiseArray = [];
    const counter = 3;
    let filteredBookings;
    const { hotels } = (await getHotels(
      cityID,
      checkInDate,
      checkOutDate
    )) as any;
    // console.log(response.hotels[0]);

    const hotelList = filterHotels(hotels);

    for (let i = 0; i < counter; i++) {
      let bookingPromise = getBooking(
        hotelList[i],
        "2023-04-01",
        "2023-04-12",
        "1"
      );

      promiseArray.push(bookingPromise);

      const bookingResponses = await Promise.all(promiseArray);

      filteredBookings = filterBookings(bookingResponses);
    }

    console.log(filteredBookings);
    /*
      const parsedData = resultsInput;

      // Store in the database, with search as key and ttl of 3h

      await putCacheEntry(searchString, parsedData);

      return parsedData;

    */

    return filteredBookings;
  } catch (error) {
    console.log(error);
    return error;
  }
};

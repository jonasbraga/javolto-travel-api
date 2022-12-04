import { getCacheEntry, putCacheEntry } from "../utils/cacheTable";
import { SearchParams } from "../crawler/types";
import { getHotels, getBooking } from "./functions/fetchMethods";
import { filterHotels, filterBookings } from "./functions/filterMethods";
import { fixedCityIDs } from "./constants/index";
const createSearchString = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.city.trim().toLowerCase();
  const sanitizedStartDate = searchInput.checkInDate.trim().toLowerCase();
  const sanitizedEndDate = searchInput.checkOutDate.trim().toLowerCase();

  return `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}`;
};

/**
 * Continue execution of the crawler in another step function execution
 */
export const hotelCrawl = async (search: SearchParams) => {
  const {
    city = "Berlin",
    checkInDate = "2023-04-01",
    checkOutDate = "2023-04-12",
  } = search;
  const searchString = createSearchString(search);

  // Search in the cache database for the data
  const cachedData = await getCacheEntry(searchString);

  // If it's cached, return, otherwise scrap the data
  if (cachedData) {
    return cachedData;
  }

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

    const response = {
      hotels: filteredBookings,
    };

    await putCacheEntry(searchString, response);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

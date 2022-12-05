import { SearchParams } from "../crawler/types";
import { getCacheEntry, putCacheEntry } from "../utils/cacheTable";
import { getFlights } from "./functions/fetchMethods";
import { filterFlights } from "./functions/filterMethods";
import { fixedCityCodes } from "./constants/index";

const createSearchString = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.city.trim().toLowerCase();
  const sanitizedStartDate = searchInput.checkInDate.trim().toLowerCase();
  const sanitizedEndDate = searchInput.checkOutDate.trim().toLowerCase();
  const sanitizedPeople = searchInput.people?.toString();

  return `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}-${sanitizedPeople}`;
};

export const travelCrawl = async (search: SearchParams) => {
  const {
    city = "Berlin",
    checkInDate = "2023-04-01",
    checkOutDate = "2023-04-20",
    people = 1,
  } = search;
  const DEPARTURE_CITY = "São Paulo";

  const searchString = createSearchString(search);
  // Search in the cache database for the data
  const cachedData = await getCacheEntry(searchString);

  // If it's cached, return, otherwise scrap the data
  if (cachedData) {
    return cachedData;
  }

  try {
    const departureCityCode = fixedCityCodes[DEPARTURE_CITY];
    const arrivalCityCode = fixedCityCodes[city];
    const responseApi = await getFlights(
      departureCityCode,
      arrivalCityCode,
      people,
      checkInDate,
      checkOutDate
    );
    const filteredFlights = filterFlights(responseApi);

    console.log(filteredFlights);

    const response = {
      travels: filteredFlights,
    };

    await putCacheEntry(searchString, response);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

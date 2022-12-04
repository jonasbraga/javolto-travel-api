import { initBrowser } from "../crawler/core";
import { SearchParams, SearchWithUrl } from "../crawler/types";
import { getCacheEntry, putCacheEntry } from "../utils/cacheTable";
import { getVehicles } from "./functions/fetchMethods";
import { filterVehicles } from "./functions/filterMethods";
import { fixedCityCodes } from "./constants/index";

const createSearchString = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.city.trim().toLowerCase();
  const sanitizedStartDate = searchInput.checkInDate.trim().toLowerCase();
  const sanitizedEndDate = searchInput.checkOutDate.trim().toLowerCase();

  return `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}`;
};

export const vehicleCrawl = async (search: SearchParams) => {
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

  const pickupTime = "13:00:00",
    returnTime = "13:00:00";

  try {
    const checkInDateTime = checkInDate + " " + pickupTime;
    const checkOutDateTime = checkOutDate + " " + returnTime;

    const pickupCityCode = fixedCityCodes[city];

    const responseApi = await getVehicles(
      pickupCityCode,
      checkInDateTime,
      checkOutDateTime
    );

    const filteredVehicles = filterVehicles(responseApi);

    const response = {
      vehicles: filteredVehicles,
    };

    await putCacheEntry(searchString, response);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

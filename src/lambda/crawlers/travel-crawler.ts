import { initBrowser } from '../crawler/core';
import { SearchParams, SearchWithUrl } from '../crawler/types';
import { getCacheEntry, putCacheEntry } from '../utils/cacheTable';
import { getFlights } from './functions/fetchMethods';
import { filterFlights } from './functions/filterMethods';
import { fixedCityCodes } from './constants/index';

const createSearchString = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.destination.trim().toLowerCase();
  const sanitizedStartDate = searchInput.startDate;
  const sanitizedEndDate = searchInput.endDate;

  return `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}`;
};

export const travelCrawl = async (
  departureCity = 'São Paulo',
  arrivalCity = 'Berlin',
  passengerNumber = '1',
  departureDate = '2023-04-01',
  returnDate = '2023-04-20'
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
    const departureCityCode = fixedCityCodes[departureCity];
    const arrivalCityCode = fixedCityCodes[arrivalCity];
    const response = await getFlights(
      departureCityCode,
      arrivalCityCode,
      passengerNumber,
      departureDate,
      returnDate
    );
    const filteredFlights = filterFlights(response);

    return filteredFlights;
  } catch (error) {
    console.log(error);
  }
};

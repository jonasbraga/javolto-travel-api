import { initBrowser } from '../crawler/core';
import { SearchParams, SearchWithUrl } from '../crawler/types';
import { getCacheEntry, putCacheEntry } from '../utils/cacheTable';
import { getVehicles } from './functions/fetchMethods';
import { filterFlights, filterVehicles } from './functions/filterMethods';
import { fixedCityCodes } from './constants/index';

export const vehicleCrawl = async (
  pickupLocation = 'Berlin',
  pickupDate = '2023-04-15',
  returnDate = '2023-04-20',
  pickupTime = '13:00:00',
  returnTime = '13:00:00'
) => {
  try {
    const pickupDateTime = pickupDate + ' ' + pickupTime;
    const returnDateTime = returnDate + ' ' + returnTime;

    const pickupCityCode = fixedCityCodes[pickupLocation];

    const response = await getVehicles(
      pickupCityCode,
      pickupDateTime,
      returnDateTime
    );

    const filteredVehicles = filterVehicles(response);

    return filteredVehicles;
  } catch (error) {
    console.log(error);
  }
};

import * as AWS from 'aws-sdk';
// import { updateHistoryEntry } from "../utils/cacheTable";
import { CrawlContext } from '../crawler/types';
import {getHotels} from './functions/fetchMethods';
const sfn = new AWS.StepFunctions();
const baseUrl =
  'https://priceline-com-provider.p.rapidapi.com/v1/hotels/search';

/**
 * Continue execution of the crawler in another step function execution
 */
export const hotelCrawl = async () => {
  console.log('running3');
  try {
     const response = await getHotels(baseUrl);
  console.log(response.hotels[0]);
  } catch (error) {
    console.log(error)
  }
 
};
hotelCrawl();

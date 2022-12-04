import { SearchParams } from "./crawler/types";
import { travelCrawl } from "./crawlers/travel-crawler";
import { vehicleCrawl } from "./crawlers/vehicle-crawler";
import { toursCrawl } from "./crawlers/tours-crawler";
import { hotelCrawl } from "./crawlers/hotel-crawler";

const { CACHE_TABLE_NAME } = process.env;

/**
 * Responsible for starting a crawl
 */
export const travelCrawlHandler = async (event: any, context: any) => {
  console.log(event, context);

  if (!CACHE_TABLE_NAME) {
    throw new Error(
      "Environment not configured correctly. CACHE_TABLE_NAME must be specified"
    );
  }

  const {
    city = "Berlin",
    checkInDate = "2023-04-01",
    checkOutDate = "2023-04-20",
  } = event;

  const input: SearchParams = {
    city,
    checkInDate,
    checkOutDate,
  };

  const travelResponse = await travelCrawl(input);

  return travelResponse;
};

/**
 * Read all non visited urls from context table so that they can be passed to the crawl lambdas
 */
export const vehicleCrawlHandler = async (event: any, context: any) => {
  console.log(event, context);

  if (!CACHE_TABLE_NAME) {
    throw new Error(
      "Environment not configured correctly. CACHE_TABLE_NAME must be specified"
    );
  }

  const { city, checkInDate, checkOutDate } = event;

  const input: SearchParams = {
    city,
    checkInDate,
    checkOutDate,
  };

  const hotelResponse = await vehicleCrawl(input);

  return hotelResponse;
};

/**
 * Given a single webpage, extract its content and optionally write to the s3 bucket, extract urls and write any new urls to
 * context database
 */
export const toursCrawlHandler = async (event: any, context: any) => {
  console.log(event, context);

  const { path } = event;

  return await toursCrawl(path);
};

/**
 * Responsible for continuing execution via another state machine execution if we're getting too close to the maximum
 * number of steps in our state machine execution.
 */
export const hotelCrawlHandler = async (event: any, context: any) => {
  console.log(event, context);

  // Clear the context database
  if (!CACHE_TABLE_NAME) {
    throw new Error(
      "Environment not configured correctly. CACHE_TABLE_NAME must be specified"
    );
  }

  const { city, checkInDate, checkOutDate } = event;

  const input: SearchParams = {
    city,
    checkInDate,
    checkOutDate,
  };

  const hotelResponse = await hotelCrawl(input);

  return hotelResponse;
};

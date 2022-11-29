import { initBrowser } from "../crawler/core";
import { SearchParams, SearchWithUrl } from "../crawler/types";
import { getCacheEntry, putCacheEntry } from "../utils/cacheTable";

const createSearchString = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.destination.trim().toLowerCase();
  const sanitizedStartDate = searchInput.startDate;
  const sanitizedEndDate = searchInput.endDate;

  return `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}`;
};

export const toursCrawl = async (search: SearchWithUrl) => {
  const searchString = createSearchString(search);
  // Search in the cache database for the data
  const cachedData = getCacheEntry(searchString);

  // If it's cached, return, otherwise scrap the data
  if (cachedData) {
    return cachedData;
  }

  // Go to site URL
  const browser = await initBrowser();

  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(90_000);

  await page.goto(search.url, {
    waitUntil: "networkidle0",
  });

  // Search for the location
  await page.type("#destinationInput", search.destination);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.type("#startDate", search.startDate.toString());
  await page.type("#endDate", search.endDate.toString());

  const searchButton = "#myBtn";

  // Wait for results
  await Promise.all([page.click(searchButton), page.waitForNavigation()]);

  // Get the results (at least 3)

  const resultsInput = await page.evaluate(
    'document.querySelector("#travelResults").value'
  );
  /* const html = await page.evaluate(
    () => document.body.innerHTML
  ); */

  // Parse the data, json like

  const parsedData = resultsInput;

  // Store in the database, with search as key and ttl of 3h

  await putCacheEntry(searchString, parsedData);

  return parsedData;
};

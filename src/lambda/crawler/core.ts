import { Browser, Page } from "puppeteer-core";
import { URL } from "url";
import * as path from "path";
import { CrawlDestination, CrawlPageInput, PageContent } from "./types";
import chrome from "chrome-aws-lambda";

export const initBrowser = async () => {
  let browser = await chrome.puppeteer.launch({
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    ignoreHTTPSErrors: true,
  });

  return browser;
};

/**
 * Extract content from a page. This provides a basic content extraction mechanism. You can make this more advanced and
 * add logic to further process a page here.
 * @param page puppeteer browser page
 */
const extractContent = async (page: Page): Promise<PageContent> => {
  const [title, htmlContent] = await Promise.all([
    page.evaluate(() => document.title),
    page.evaluate(() => document.body.innerHTML),
  ]);
  return { title, htmlContent };
};

/**
 * Return whether the given url is within the website of the base url, ie it's a relative link, or it's an absolute
 * link that starts with the base url.
 */
const isUrlWithinBaseWebsite = (url: string, baseUrl: string): boolean =>
  !url.startsWith("http") || url.startsWith(baseUrl);

/**
 * Return whether any of the keywords are included in the url. Keywords are optional, we include the url by default
 * if they aren't supplied.
 */
const isUrlMatchingSomeKeyword = (url: string, keywords?: string[]): boolean =>
  !keywords ||
  keywords.length === 0 ||
  keywords.some((keyword) => url.toLowerCase().includes(keyword));

/**
 * Return all the urls from a page that we may enqueue for further crawling
 * @return a list of absolute urls
 */
const getLinksToFollow = async (
  page: Page,
  baseUrl: string,
  keywords?: string[]
): Promise<string[]> => {
  // Find all the anchor tags and get the url from each
  const urls = await page.$$eval("a", (elements) =>
    elements.map((e) => e.getAttribute("href"))
  );

  // Get the base url for any relative urls
  const currentPageUrlParts = (
    await page.evaluate(() => document.location.href)
  ).split("/");
  const relativeUrlBase = currentPageUrlParts
    .slice(0, currentPageUrlParts.length)
    .join("/");

  // Filter to only urls within our target website, and urls that match the provided keywords
  return urls
    .filter((url: string | null) => url && isUrlWithinBaseWebsite(url, baseUrl))
    .map((url) => {
      if (url!.startsWith(baseUrl)) {
        return url!;
      }
      const u = new URL(url!, relativeUrlBase);
      return `${u.origin}${u.pathname}`;
    })
    .filter((url) => isUrlMatchingSomeKeyword(url, keywords));
};

/**
 * Uses the given browser to load the given page, writes its content to the destination, and returns any discovered urls
 * discovered from the page.
 *
 * @param browser the puppeteer browser
 * @param input the page to visit
 * @param destination (optional) the location to write content to
 * @return a list of paths (relative to the base url) that were found on the page
 */
export const extractPageContentAndUrls = async (
  browser: Browser,
  input: CrawlPageInput
): Promise<string[]> => {
  const url = new URL(input.path, input.baseUrl).href;
  try {
    // Visit the url and wait until network settles, a reasonable indication that js libraries etc have all loaded and
    // client-side rendering or ajax calls have completed
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // Extract the content from the page
    const content = await extractContent(page);
    console.log("Extracted content from page:", content);

    // Find fully qualified urls with the given base url
    const discoveredUrls = new Set(
      await getLinksToFollow(page, input.baseUrl, input.pathKeywords)
    );
    console.log("Discovered urls:", discoveredUrls);

    // We return relative paths
    const discoveredPaths = [...discoveredUrls].flatMap((u) => {
      try {
        return [new URL(u).pathname];
      } catch (e) {
        console.warn("Url", u, "was not valid and will be skipped", e);
        return [];
      }
    });
    console.log("Discovered relative paths:", discoveredPaths);

    return discoveredPaths;
  } catch (e) {
    console.warn("Could not visit url", url, e);
    return [];
  }
};

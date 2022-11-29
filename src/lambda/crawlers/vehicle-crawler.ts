import * as AWS from "aws-sdk";
import { extractPageContentAndUrls } from "../crawler/core";
import { CrawlContext } from "../crawler/types";
import { markPathAsVisited, queuePaths } from "../utils/contextTable";
import chrome from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

const s3 = new AWS.S3();

/**
 * This step is the main part of the webcrawler, responsible for extracting content from a single webpage, and adding
 * any newly discovered urls to visit to the queue.
 */
export const vehicleCrawl = async (path: string) => {
  return {};
};

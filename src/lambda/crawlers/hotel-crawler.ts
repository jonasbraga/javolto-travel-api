import * as AWS from "aws-sdk";
import { CrawlContext } from "../crawler/types";

const sfn = new AWS.StepFunctions();

/**
 * Continue execution of the crawler in another step function execution
 */
export const hotelCrawl = async (crawlContext: CrawlContext) => {};

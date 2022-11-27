import * as AWS from "aws-sdk";
import crypto from "node:crypto";

const { CACHE_TABLE_NAME } = process.env;
const ddb = new AWS.DynamoDB.DocumentClient();

/*
const createKeyFromSearch = (searchInput: SearchParams) => {
  const sanitizedDestination = searchInput.destination.trim().toLowerCase();
  const sanitizedStartDate = searchInput.startDate;
  const sanitizedEndDate = searchInput.endDate;
  const sanitizedRooms = searchInput.rooms;

  const searchString = `${sanitizedDestination}-${sanitizedStartDate}-${sanitizedEndDate}-${sanitizedRooms}`;

  const hash = crypto.createHash("md5").update(searchString).digest("hex");

  return { hash, searchString };
};
 */

/**
 * Read an entry from the history table
 * @param crawlId id of the crawl
 */
export const getCacheEntry = async (searchString: string) => {
  const hash = crypto.createHash("md5").update(searchString).digest("hex");

  const data = await ddb
    .get({
      TableName: CACHE_TABLE_NAME!,
      Key: {
        crawlId: hash,
      },
      ConsistentRead: true,
    })
    .promise();

  return data.Item;
};

/**
 * Adds a new entry to the history table
 * @param historyEntry the entry to add
 */
export const putCacheEntry = async (searchString: string, entry: object) => {
  const hash = crypto.createHash("md5").update(searchString).digest("hex");
  await ddb
    .put({
      TableName: CACHE_TABLE_NAME!,
      Item: {
        ...entry,
        crawlId: hash,
        ttl: CACHE_EXPIRATION.ttl,
      },
    })
    .promise();
};

const CACHE_EXPIRATION = {
  // 3 hours
  seconds: 3 * 60 * 60,
  get ttl() {
    return (Date.now() + this.seconds * 1000) / 1000;
  },
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Construct } from "constructs";
import { Function } from "aws-cdk-lib/aws-lambda";
import WebCrawlerLambda from "./web-crawler-lambda";
import ChromeLambdaLayer from "./chrome-lambda-layer";
import CacheTable from "./cache-table";

export interface WebCrawlerLambdasProps {
  region: string;
}

export interface WebCrawlers {
  travelCrawl: Function;
  vehicleCrawl: Function;
  toursCrawl: Function;
  hotelCrawl: Function;
}

/**
 * Construct which creates all the necessary lambdas for our web crawler
 */
export default class WebCrawlerLambdas extends Construct {
  public readonly crawlers: WebCrawlers;

  constructor(scope: Construct, id: string, props: WebCrawlerLambdasProps) {
    super(scope, id);

    const { region } = props;

    // Layer including chrome for the web crawler lambdas
    const chromeLayer = new ChromeLambdaLayer(this, "ChromeLayer");

    // Helper method to create a web crawler lambda with common properties and table policies
    const buildLambda = (
      id: string,
      handler: string,
      cacheTableName: string
    ) => {
      const cacheTable = new CacheTable(this, `${id}CacheTable`, {
        tableName: cacheTableName,
      });
      const lambda = new WebCrawlerLambda(this, id, {
        handler,
        environment: {
          CACHE_TABLE_NAME: cacheTable.tableName,
        },
        region,
        chromeLayer,
      });
      cacheTable.grantReadWriteData(lambda);

      return lambda;
    };

    // Lambda for travel crawling
    const travelCrawl = buildLambda(
      "TravelCrawl",
      "travelCrawlHandler",
      "travel-cache-table"
    );

    // Lambda for vehicle crawling
    const vehicleCrawl = buildLambda(
      "VehicleCrawl",
      "vehicleCrawlHandler",
      "vehicle-cache-table"
    );

    // Lambda for tours crawling
    const toursCrawl = buildLambda(
      "ToursCrawl",
      "toursCrawlHandler",
      "tours-cache-table"
    );

    // Lambda for hotel crawling
    const hotelCrawl = buildLambda(
      "HotelCrawl",
      "hotelCrawlHandler",
      "hotel-cache-table"
    );

    this.crawlers = {
      travelCrawl,
      vehicleCrawl,
      toursCrawl,
      hotelCrawl,
    };
  }
}

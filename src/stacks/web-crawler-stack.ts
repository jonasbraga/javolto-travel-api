// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import WebCrawlerLambdas from "../constructs/webcrawler/web-crawler-lambdas";
import TripsLambda from "../constructs/trips-api/trip-lambda";

export interface WebCrawlerStackProps extends StackProps {}

/**
 * This stack deploys the serverless webcrawler
 */
export class WebCrawlerStack extends Stack {
  constructor(scope: Construct, id: string, props: WebCrawlerStackProps) {
    super(scope, id, props);

    // Create all the lambdas for our webcrawler
    const { crawlers } = new WebCrawlerLambdas(this, "WebCrawlerLambdas", {
      region: this.region,
    });

    const tripLambda = new TripsLambda(this, "TripsLambdaStack", {
      region: this.region,
      crawlers,
    });
  }
}

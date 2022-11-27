import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { WebCrawlers } from "../webcrawler/web-crawler-lambdas";

export interface WebCrawlerLambdaProps {
  region: string;
  crawlers: WebCrawlers;
  environment?: { [key: string]: string };
}

/**
 * Construct for a lambda function with code in the 'lambda' directory.
 */
export default class TripsLambda extends Construct {
  readonly function: NodejsFunction;
  constructor(scope: Construct, id: string, props: WebCrawlerLambdaProps) {
    super(scope, id);
    const lambdaFunction = new NodejsFunction(scope, "TripsLambda", {
      runtime: Runtime.NODEJS_16_X,
      entry: "./src/lambda/index.ts",
      handler: "getTrips",
      timeout: Duration.minutes(2),
      environment: props.environment,
    });

    // Allowing lambda to call crawlers lambdas
    lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["lambda:InvokeFunction"],
        resources: [
          props.crawlers.hotelCrawl.functionArn,
          props.crawlers.toursCrawl.functionArn,
          props.crawlers.travelCrawl.functionArn,
          props.crawlers.vehicleCrawl.functionArn,
        ],
      })
    );

    this.function = lambdaFunction;
  }
}

import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import ChromeLambdaLayer from "./chrome-lambda-layer";

export interface WebCrawlerLambdaProps {
  handler: string;
  region: string;
  chromeLayer: ChromeLambdaLayer;
  environment?: { [key: string]: string };
}

/**
 * Construct for a lambda function with code in the 'lambda' directory.
 */
export default class WebCrawlerLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: WebCrawlerLambdaProps) {
    super(scope, id, {
      runtime: Runtime.NODEJS_16_X,
      entry: "./src/lambda/crawlers.ts",
      layers: [props.chromeLayer],
      handler: props.handler,
      timeout: Duration.minutes(5),
      memorySize: 1600,
      environment: props.environment,
      bundling: {
        externalModules: ["chrome-aws-lambda", "puppeteer", "puppeteer-core"],
      },
    });
  }
}

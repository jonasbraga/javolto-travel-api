import { Construct } from "constructs";
import { LayerVersion, Code } from "aws-cdk-lib/aws-lambda";

/**
 * Lambda layer which includes chromium, enabling lambdas to use Puppeteer
 */
export default class ChromeLambdaLayer extends LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: Code.fromAsset("chromelayer"),
    });
  }
}

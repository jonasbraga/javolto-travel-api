#!/usr/bin/env node

import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { WebCrawlerStack } from "../src/stacks/web-crawler-stack";

const app = new App();

// Create the webcrawler stack
new WebCrawlerStack(app, "WebCrawlerStack", {});

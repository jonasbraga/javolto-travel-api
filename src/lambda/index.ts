import * as AWS from "aws-sdk";

const {
  HOTEL_CRAWL_FUNCTION_NAME,
  TOURS_CRAWL_FUNCTION_NAME,
  TRAVEL_CRAWL_FUNCTION_NAME,
  VEHICLE_CRAWL_FUNCTION_NAME,
} = process.env;

export const getTrips = async (event: any, context: any) => {
  console.log(event, context);

  const { city, checkInDate, checkOutDate, people, type } =
    event.queryStringParameters;

  const lambda = new AWS.Lambda({
    region: "us-east-1", //change to your region
  });

  const crawlers = getSelectedCrawlers(type);

  const promises = crawlers.map((functionName) => {
    return lambda
      .invoke({
        FunctionName: functionName!,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({
          city,
          checkInDate,
          checkOutDate,
          people,
        }),
      })
      .promise();
  });

  const result = await Promise.allSettled(promises);

  console.log(result);

  const resultFormated = result
    .filter((response: { status: string }) => response.status === "fulfilled")
    .map((response: any) => response.value.Payload)
    .reduce((acc, curr) => {
      return { ...acc, ...JSON.parse(curr) };
    }, {});

  console.log({ resultFormated });

  return resultFormated;
};

const getSelectedCrawlers = (type: string): string[] => {
  const crawlers = [];
  type.includes("hotels") && crawlers.push(HOTEL_CRAWL_FUNCTION_NAME!);
  type.includes("travels") && crawlers.push(TRAVEL_CRAWL_FUNCTION_NAME!);
  type.includes("vehicles") && crawlers.push(VEHICLE_CRAWL_FUNCTION_NAME!);
  type.includes("tours") && crawlers.push(TOURS_CRAWL_FUNCTION_NAME!);
  return crawlers;
};

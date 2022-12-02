import * as AWS from "aws-sdk";

const {
  HOTEL_CRAWL_FUNCTION_NAME,
  TOURS_CRAWL_FUNCTION_NAME,
  TRAVEL_CRAWL_FUNCTION_NAME,
  VEHICLE_CRAWL_FUNCTION_NAME,
} = process.env;

export const getTrips = async (event: any, context: any) => {
  console.log(event, context);

  const { city, checkInDate, checkOutDate, rooms } = event.Payload;

  const lambda = new AWS.Lambda({
    region: "us-east-1", //change to your region
  });

  const crawlers = [
    HOTEL_CRAWL_FUNCTION_NAME,
    //TOURS_CRAWL_FUNCTION_NAME,
    //TRAVEL_CRAWL_FUNCTION_NAME,
    //VEHICLE_CRAWL_FUNCTION_NAME,
  ];

  const promises = crawlers.map((functionName) => {
    lambda
      .invoke({
        FunctionName: functionName!,
        Payload: JSON.stringify({
          city,
          checkInDate,
          checkOutDate,
          rooms,
        }),
      })
      .promise();
  });

  const result = await Promise.allSettled(promises);

  return JSON.stringify(result);
};

import * as AWS from "aws-sdk";
// import { updateHistoryEntry } from "../utils/cacheTable";
import { CrawlContext } from "../crawler/types";
import axios from 'axios';
const sfn = new AWS.StepFunctions();

/**
 * Continue execution of the crawler in another step function execution
 */
export const hotelCrawl = async () => {
  console.log('running2')

var config = {
  method: 'get',
  url: 'https://priceline-com-provider.p.rapidapi.com/v1/hotels/search?sort_order=PRICE&location_id=3000035821&date_checkout=2022-12-12&date_checkin=2022-12-01&star_rating_ids=3.0,3.5,4.0,4.5,5.0',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', 
    'Accept-Encoding': 'identity',
    'X-RapidAPI-Key': '075d9986b1mshf7fe78bb29d44a3p173798jsn90f9820584bd',
    'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

};

hotelCrawl()


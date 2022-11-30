import fetch from 'node-fetch';

export const getHotels = async (baseUrl: string) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': '075d9986b1mshf7fe78bb29d44a3p173798jsn90f9820584bd',
    'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
  };

  const params = {
    sort_order: 'PRICE',
    location_id: '3000035821',
    date_checkout: '2023-04-12',
    date_checkin: '2023-04-01',
    star_rating_ids: '3.0,3.5,4.0,4.5,5.0',
  };
  const response = await fetch(baseUrl + '?' + new URLSearchParams(params), {
    method: 'GET',
    headers,
  });

  const data = await response.json();
 return data
};

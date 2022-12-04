import fetch from 'node-fetch';

const baseUrl = 'https://priceline-com-provider.p.rapidapi.com/v1';

const headers = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': '075d9986b1mshf7fe78bb29d44a3p173798jsn90f9820584bd',
  'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
};

export const getHotels = async (
  location_id: string,
  date_checkin: string,
  date_checkout: string
) => {
  let params = {
    sort_order: 'PRICE',
    location_id,
    date_checkout,
    date_checkin,
    star_rating_ids: '3.0,3.5,4.0,4.5,5.0',
  };
  const response = await fetch(
    baseUrl + '/hotels/search' + '?' + new URLSearchParams(params),
    {
      method: 'GET',
      headers,
    }
  );

  const data = await response.json();
  return data;
};

export const getBooking = async (
  hotel_id: string,
  date_checkin: string,
  date_checkout: string,
  rooms_number: string
) => {
  let params = {
    date_checkout,
    date_checkin,
    hotel_id,
    rooms_number,
  };

  const response = await fetch(
    baseUrl + '/hotels/booking-details' + '?' + new URLSearchParams(params),
    {
      method: 'GET',
      headers,
    }
  );

  const data = await response.json();
  return data;
};

export const getFlights = async (
  location_departure: string,
  location_arrival: string,
  number_of_passengers: string,
  date_departure: string,
  date_departure_return: string
) => {
  let params = {
    itinerary_type: 'ROUND_TRIP',
    class_type: 'ECO',
    location_arrival,
    date_departure,
    location_departure,
    sort_order: 'PRICE',
    number_of_stops: '1',
    price_max: '20000',
    number_of_passengers,
    duration_max: '2051',
    price_min: '100',
    date_departure_return,
  };

  const response = await fetch(
    baseUrl + '/flights/search' + '?' + new URLSearchParams(params),
    {
      method: 'GET',
      headers,
    }
  );

  const data = await response.json();
  return data;
};

export const getVehicles = async (
  location_pickup: string,
  date_time_pickup: string,
  date_time_return: string
) => {
  let params = {
    location_pickup,
    date_time_return,
    date_time_pickup,
    location_return: location_pickup,
  };

  const response = await fetch(
    baseUrl + '/cars-rentals/search' + '?' + new URLSearchParams(params),
    {
      method: 'GET',
      headers,
    }
  );

  const data = await response.json();
  return data;
};

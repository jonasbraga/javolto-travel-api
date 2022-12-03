import { Booking, Dictionary, Flight } from '../../crawler/types';

export const filterHotels = (hotelList: Array<any>) => {
  //Buscamos aqui hoteis com alguma vaga para filtrar melhor
  const HotelIDList = hotelList
    .filter(
      (hotel) =>
        hotel.ratesSummary.roomLeft &&
        hotel.ratesSummary.roomLeft > 0 &&
        hotel.hotelId != undefined
    )
    .map((hotel) => hotel.hotelId);

  return HotelIDList;
};

export const filterBookings = (bookings: Array<any>) => {
  const bookingsArray: Array<Booking> = [];

  //Buscamos aqui hoteis com alguma vaga para filtrar melhor

  bookings.forEach((booking) => {
    let bookingObj = <Booking>{};
    (bookingObj.hotelName = booking.name),
      (bookingObj.hotelBrand = booking.brand),
      (bookingObj.hotelDescription = booking.description),
      (bookingObj.hotelStarRating = booking.starRating),
      (bookingObj.hotelAddress = booking.location.address),
      (bookingObj.hotelImageUrl = booking.thumbnailUrl),
      (bookingObj.roomName = booking.rooms[0].roomDisplayName);
    bookingObj.roomLongDescription = booking.rooms[0].longDescription;
    bookingObj.roomPrice = booking.rooms[0].displayableRates[0].displayPrice;
    bookingObj.currency = booking.rooms[0].displayableRates[0].displayCurrency;
    bookingObj.roomImageUrl = booking.rooms[0].images[0].imageUrl;

    bookingsArray.push(bookingObj);
  });

  return bookingsArray;
};

export const filterFlights = (flights: any) => {
  const airportDictionary = <Dictionary>{};
  const airlineDictionary = <Dictionary>{};

  const flightsArray: Array<Flight> = [];

  //Aqui pegamos o nome de cada aeroporto e linha area encontrada para a busca
  flights.airport.forEach((airport: any) => {
    airportDictionary[airport.code] = airport.name;
  });

  flights.airline.forEach((airline: any) => {
    airlineDictionary[airline.code] = airline.name;
  });

  flights.filteredTripSummary.carrier.forEach((carrier: any) => {
    let flightObj = <Flight>{};

    flightObj.airline = airlineDictionary[carrier.code];
    flightObj.origAirport = airportDictionary[carrier.airport[0].origAirport];
    flightObj.destAirport = airportDictionary[carrier.airport[0].destAirport];
    flightObj.price = carrier.airport[0].stops[0].lowestTotalFare;
    flightObj.currency =
      flights.filteredTripSummary.airline[0].lowestTotalFare.currency;
    flightsArray.push(flightObj);
  });

  flightsArray.sort((a, b) => {
    if (a.price > b.price) return 1;
    else if (a.price < b.price) return -1;
    else return 0;
  });

  return flightsArray;
};

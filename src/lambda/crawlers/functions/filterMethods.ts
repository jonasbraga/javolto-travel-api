import { Booking } from "../../crawler/types";

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

    const bookingsArray: Array<Booking>=[];
  
  //Buscamos aqui hoteis com alguma vaga para filtrar melhor
 
  bookings.forEach((booking) => 
  {
    let bookingObj = <Booking>{};
    bookingObj.hotelName = booking.name,
    bookingObj.hotelBrand= booking.brand,
    bookingObj.hotelDescription = booking.description,
    bookingObj.hotelStarRating = booking.starRating,
    bookingObj.hotelAddress = booking.location.address,
    bookingObj.hotelImageUrl = booking.thumbnailUrl,
    bookingObj.roomName = booking.rooms[0].roomDisplayName
    bookingObj.roomLongDescription = booking.rooms[0].longDescription
    bookingObj.roomPrice = booking.rooms[0].displayableRates[0].displayPrice+' '+booking.rooms[0].displayableRates[0].displayCurrency
    bookingObj.roomImageUrl = booking.rooms[0].images[0].imageUrl

    bookingsArray.push(bookingObj)
  });

  return bookingsArray;
};

import http from "../http-common";

class ReservationDataService {
  createReservation(newReservation) {
    console.log(newReservation);
    return http.post("/reservation", newReservation);
  }

  updateReservation(updatedReservation, previousReservation) {
    return http.post(`/reservation/update`, {
      updatedReservation: updatedReservation,
      previousReservation: previousReservation,
    });
  }

  getAllReservations() {
    return http.get("/reservation/all");
  }

  getReservationByPhone(phoneNum) {
    return http.get(`/reservation/phone/${phoneNum}`);
  }

  getReservationsByCustomerLocationDate(Customer, Location, Datetime) {
    return http.get(
      `/reservation/update/get/${Customer}/${Location}/${Datetime}`
    );
  }

  deleteReservation(Customer, Location, Datetime) {
    const url = `/reservation/delete/${encodeURIComponent(
      Customer
    )}/${encodeURIComponent(Location)}/${encodeURIComponent(Datetime)}`;
    console.log("DELETE URL:", url);

    return http.delete(url);
  }

  getReservationsByLocation(location) {
    return http.get(`/reservation/location/${location}`);
  }

  getAllTimesForLocation(location) {
    return http.get(`/times/location/${location}`);
  }

  // getReservationsByLocationDate(Location, DateTime) {
  //   return http.get(`/reservation/${Location}/${DateTime}`);
  // }
}

export default new ReservationDataService();

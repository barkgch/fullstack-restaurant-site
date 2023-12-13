import http from "../http-common";

class ReservationDataService {
  createReservation(newReservation) {
    return http.post("/reservation/", newReservation);
  }

  getAllReservations() {
    return http.get("/reservation/all");
  }

  getReservationByPhone(phoneNum) {
    return http.get(`/reservation/phone/${phoneNum}`);
  }

  updateReservation(customerEmail, datetime, updatedReservation) {
    return http.put(
      `/reservation/update/${customerEmail}/${datetime}`,
      updatedReservation
    );
  }

  deleteReservation(customerEmail, datetime) {
    return http.delete(`/reservation/delete/${customerEmail}/${datetime}`);
  }

  getReservationsByLocation(location) {
    return http.get(`/reservation/location/${location}`);
  }

  getAllTimesForLocation(location) {
    return http.get(`/times/location/${location}`);
  }

  getReservationsByLocationDate(Location, DateTime) {
    return http.get(`/reservation/${Location}/${DateTime}`);
  }
}

export default new ReservationDataService();

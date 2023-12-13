import http from "../http-common";

class SpecialReservationDataService {
  // Method to create a new special reservation
  createSpecialReservation(reservationData) {
    return http.post("/specialRes", reservationData);
  }

  // Method to get a special reservation by location
  findByLocation(location) {
    return http.get(`/specialRes/location/${location}`);
  }
}

export default new SpecialReservationDataService();

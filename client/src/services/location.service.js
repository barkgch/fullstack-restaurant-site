import http from "../http-common";

class LocationDataService {
  getAllLocation() {
    return http.get("/location/all");
  }

  // Fetch all location names
  getDistinguish() {
    return http.get("/location/names");
  }
}

export default new LocationDataService();

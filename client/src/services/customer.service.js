import http from "../http-common";

class CustomerDataService {
  getAll() {
    return http.get("/customer");
  }

  get(phoneNum) {
    return http.get(`/customer/${phoneNum}`);
  }

  create(data) {
    return http.post("/customer", data);
  }

  update(phoneNum, data) {
    return http.put(`/customer/${phoneNum}`, data);
  }

  delete(phoneNum) {
    return http.delete(`/customer/${phoneNum}`);
  }

  deleteAll() {
    return http.delete(`/customer`);
  }
}

export default new CustomerDataService();

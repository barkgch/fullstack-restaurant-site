/**
 * All directions to API account-related routes for use by all client pages.
 * 
 * Corresponds to routes defined in /api/routes/account.routes.js
 */
import http from "../http-common";

class AccountDataService {
  registerCustomer(accountInfo) {
    return(http.post("/account/customer/register/", accountInfo));
  }
  registerEmployee(accountInfo) {
    return(http.post("/account/employee/register/", accountInfo));
  }

  getCustomer(AccountID) {
    return (http.get(`/account/customer/${AccountID}`));
  }
  getEmployee(AccountID) {
    return (http.get(`/account/employee/${AccountID}`));
  }

  updateCustomer(AccountID, updateInfo) {
    return(http.post(`/account/customer/update/${AccountID}`, updateInfo));
  }
  updateEmployee(AccountID, updateInfo) {
    return(http.post(`/account/employee/update/${AccountID}`, updateInfo));
  }

  loginCustomer(accountInfo) {
    return(http.post("/account/customer/login/", accountInfo));
  }
  loginEmployee(accountInfo) {
    return (http.post(`/account/employee/login/`, accountInfo));
  }

  deleteCustomer(AccountID) {
    return (http.delete(`/account/customer/${AccountID}`));
  }
  deleteEmployee(AccountID) {
    return (http.delete(`/account/employee/${AccountID}`));
  }

  logout() {
    return (http.post(`/account/logout/`));
  }
}

export default new AccountDataService();

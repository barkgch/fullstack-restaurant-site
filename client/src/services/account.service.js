/**
 * All directions to API routes for use by all client pages.
 */
import http from "../http-common";

class AccountDataService {
  registerCustomer(accountInfo) {
    return(
      http.post("/account/customer/register/", accountInfo)
    );
  }

  updateCustomer(AccountID, updateInfo) {
    return(
      http.post(`/account/customer/update/${AccountID}`, updateInfo)
    );
  }

  loginCustomer(accountInfo) {
    return(
      http.post("/account/customer/login/")
    )
  }
}

export default new AccountDataService();

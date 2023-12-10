/**
 * Routes to take care of all login/logout actions and account creation 
 * for both customers and employees.
 * 
 * BASED ON:
 *  - tutorial.routes.js FROM
 *        https://www.bezkoder.com/node-js-rest-api-express-mysql/
 *  - Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *        https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 * 
 * @param {*} app 
 */

module.exports = app => {
  const cAccount = require("../controllers/customer_account.controller.js");
  
  var router = require("express").Router();

  router.post("/customer/register/", cAccount.register);
  router.post("/customer/update/:AccountID", cAccount.update);
  // router.post("/customer/login/", cAccount.login);

  router.post("/logout")

  // // Create a new customer account
  // router.post("/", cAccount.create);

  // // Retrieve all customer accounts
  // router.get("/", cAccount.findAll);

  // // Retrieve a single customer account with ID
  // router.get("/id=:PhoneNum", cAccount.findID);

  // // Retrieve a single customer customer with PhoneNum
  // router.get("/phone=:PhoneNum", cAccount.findPhone);

  // // Update a customer account with ID
  // router.put("/:AccountID", cAccount.update);

  // // Delete a customer account with ID
  // router.delete("/:AccountID", cAccount.delete);

  app.use('/api/account', router);
};
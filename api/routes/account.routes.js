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
  const eAccount = require('../controllers/employee_account.controller.js');
  
  var router = require("express").Router();

  router.post("/customer/register/", cAccount.register);
  router.post("/customer/login/", cAccount.login);
  router.post("/customer/update/:AccountID", cAccount.authUpdate);

  router.post("/employee/register/", eAccount.register);
  router.post("/employee/login/", eAccount.login);
  router.post("/employee/update/:AccountID", eAccount.authUpdate);

  router.get('/customer/:AccountID', cAccount.authGet);
  router.get('/employee/:AccountID', eAccount.authGet);

  router.delete('/customer/:AccountID', cAccount.authDelete);
  router.delete('/employee/:AccountID', eAccount.authDelete);

  // deletes cookie that had been generated for user.
  router.post("/logout", (req, res) => {
    res.clearCookie("access_token",{
      sameSite:"none",
      secure:true
    }).status(200).json("User has been logged out.")
  });

  app.use('/api/account', router);
};
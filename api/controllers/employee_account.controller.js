/**
 * Controller that handles creation, deletion, and modification of all employee
 * account-related information (all information within tables ACCOUNT and
 * EMPLOYEE_ACCOUNT)
 * 
 * BASED ON:
 *  - tutorial.controller.js FROM
 *        https://www.bezkoder.com/node-js-rest-api-express-mysql/
 *  - Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *        https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require("../models/account.model.js");
const EmployeeAccount = require("../models/employee_account.model.js");


/**
 * Completes employee account creation by checking existing users and adding
 * EMPLOYEE_ACCOUNT and ACCOUNT rows to the tables if no existing users.
 * 
 * Assumes `req.body` contains valid...
 *  - `Email`,
 *  - `PermissionLevel`,
 *  - `FName`,
 *  - `LName`, and
 *  - `Password`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.register = (req, res) => {
  console.log("DEBUG: req body contents:", {...req.body});

  // CHECK IF EMAIL ALREADY IN USE
  Account.findByEmail(req.body.Email, (err, data) => {
    if (data) {
      res.status(409).send({
        message: `User with email ${req.body.Email} already exists!`
      });
      return;
    }
    if (err) {
      if (err.kind != "not_found") {
        res.status(500).send({
          message: `ERROR occurred while checking email availability: ${err.message}`
        });
        return;
      }
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.Password, salt);

    // create account model object
    const account = new Account({
      Email: req.body.Email,
      Password: hash
    });
    // use model to create account in database
    Account.create(account, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "An error occurred while creating account for employee account."
        });
        return;
      }
      let id = data;

      // create employee account model object using ID returned by prev query
      const eAccount = new EmployeeAccount({
        AccountID: id,
        PermissionLevel: req.body.PermissionLevel,
        FName: req.body.FName,
        LName: req.body.LName
      });
      // use model to create employee account in database
      EmployeeAccount.create(eAccount, (err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "An error occurred while creating employee account."
          });
          // creation failed. need to delete account we created earlier.
          Account.remove(id);
          return;
        }
        res.status(200).send({
          message: `User has been created successfully.`
        });
      });
    });


  });
}


/**
 * Checks to see if exists an account with given email exists,
 * checks if account is employee account, 
 * then checks if passwords match for that account.
 * 
 * Creates access token cookie for user upon success.
 * 
 * Assumes `req.body` constains valid `Email` and `Password`.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.login = (req, res) => {
  // check if account with email exists
  Account.findByEmail(req.body.Email, (err, resultAccount) => {
    if (err) {
      if (err.kind == "not_found") {
        console.log("DEBUG: EMAIL NOT FOUND");
        res.status(400).send({
          message: "Wrong username or password!"
        });
        return;
      } else {
        console.log(`ERROR (EmployeeAccount.login) ${err.message}`);
        res.status(500).send({
          message: "INTERNAL ERROR"
        });
        return;
      }
    }
    console.log("DEBUG: EMAIL FOUND");
    // account may be employee or customer account.
    // check specifically if a customer exists with this account ID
    
    console.log('DEBUG: ', {...resultAccount});
    EmployeeAccount.findByID(resultAccount.AccountID, (err, resultEmployee) => {
      if (resultEmployee) {
        // we have determined that this account belongs to an employee
        //check password
        if (bcrypt.compareSync(req.body.Password, resultAccount.Password)) {
          // passwords match. create token for user
          const token = jwt.sign({
            id: resultAccount.AccountID,
            type: "employee",
            permission: resultEmployee.PermissionLevel
          }, "jwtsecretkey");

          // send cookie and some account info
          // httpOnly means the cookie cannot be accessed directly
          // cookie can only be accessed through API requests
          res.cookie("access_token", token, { 
            httpOnly: true 
          }).status(200).send({
            id: resultAccount.AccountID,
            type: "employee",
            permission: resultEmployee.PermissionLevel
          })
          return;
        } else {
          // password does not match
          res.status(400).send({
            message: "Wrong username or password!"
          });
          return;
        }
      }
      if (err) {
        if (err.kind == "not_found") {
          res.status(400).send({
            message: "Wrong username or password!"
          });
        } else {
          console.log(`ERROR (EmployeeAccount.login) ${err.message}`);
          res.status(500).send({
            message: "INTERNAL ERROR"
          });
          return;
        }
      }
    });
  });
}


/**
 * Update customer account with ID given by `req.params.AccountID` to values
 * given by `req.body.AccountID`, `req.body.Customer`, and `req.body.NumPastOrders`.
 * 
 * At least one of the values-to-update must be defined within the body.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
  // validate body contents
  if (!req.body) {
    res.status(400).send({
      message: "Request content cannot be empty!"
    });
  } else if (!(req.body.AccountID || req.body.Customer || req.body.NumPastOrders)) {
    res.status(400).send({
      message: "Request must define at least one field to update!"
    });
  }
  // console.log(`DEBUG: ${req.body}`);
  EmployeeAccount.update(
    req.params.AccountID,
    new EmployeeAccount(req.body),
    (err, data) => 
  {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found customer account with ID ${req.params.AccountID}.`
        });
      } else {
        res.status(500).send({
          message: `Error updating customer account with ID ${req.params.AccountID}.`
        });
      }
    } else res.send(data);
  });
};


/**
 * Delete customer account with ID given by `req.params.AccountID`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {
  EmployeeAccount.remove(req.params.AccountID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found customer account with ID ${req.params.AccountID}.`
        });
      } else {
        res.status(500).send({
          message: `Error deleting customer account with ID ${req.params.AccountID}.`
        });
      }
    } else res.send({ message: `Customer account was deleted successfully!`});
  });
};

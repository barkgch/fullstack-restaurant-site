/**
 * Controller that handles creation, deletion, and modification of all customer
 * account-related information (all information within tables ACCOUNT, CUSTOMER,
 * and CUSTOMER_ACCOUNT)
 * 
 * BASED ON:
 *  - tutorial.controller.js FROM
 *        https://www.bezkoder.com/node-js-rest-api-express-mysql/
 *  - Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *        https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 */

const bcrypt = require('bcryptjs');

const Account = require("../models/account.model.js");
const Customer = require("../models/customer.model.js");
const CustomerAccount = require("../models/customer_account.model.js");


/**
 * Completes customer account creation by checking existing users and adding
 * CUSTOMER_ACCOUNT, CUSTOMER, and ACCOUNT rows to the tables if no existing 
 * users.
 * 
 * Assumes `req.body` contains valid...
 *  - `Email`,
 *  - `PhoneNum`,
 *  - `FName`,
 *  - `LName`, and
 *  - `Password`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.register = (req, res) => {
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

    // CHECK IF PHONE NUMBER ALREADY IN USE
    Customer.findByPhone(req.body.PhoneNum, (err, data) => {
      if (data) {
        res.status(409).send({
          message: "User with number " + req.body.PhoneNum + " already exists!"
        });
        return;
      }
      if (err) {
        if (err.kind != "not_found") {
          res.status(500).send({
            message: `ERROR occurred while checking phone number availability: ${err.message}`
          });
          return;
        }
      }

      // create customer model object
      const customer = new Customer({
        PhoneNum: req.body.PhoneNum,
        FName: req.body.FName,
        LName: req.body.LName
      });
      // use model to create customer in database
      Customer.create(customer, (err, data) => {
        if (err) {
          res.status(500).send({
            message: `ERROR occurred while checking creating customer: ${err.message}`
          });
          return;
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
              message: err.message || "An error occurred while creating account for customer account."
            });
            // creation failed. need to delete customer we created earlier.
            Customer.remove(customer.PhoneNum);
            return;
          }
          let id = data;

          // create customer account model object using ID returned by prev query
          const cAccount = new CustomerAccount({
            AccountID: id,
            Customer: req.body.PhoneNum,
            NumPastOrders: 0
          });
          // use model to create customer account in database
          CustomerAccount.create(cAccount, (err, data) => {
            if (err) {
              res.status(500).send({
                message: err.message || "An error occurred while creating customer account."
              });
              // creation failed. need to delete customer and account we created earlier.
              Customer.remove(customer.PhoneNum);
              Account.remove(id);
              return;
            }
            res.status(200).send({
              message: `User has been created successfully.`
            });
          });
        });
      });
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
  CustomerAccount.update(
    req.params.AccountID,
    new CustomerAccount(req.body),
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
  CustomerAccount.remove(req.params.AccountID, (err, data) => {
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

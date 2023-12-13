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
const jwt = require('jsonwebtoken');

const Account = require("../models/account.model.js");
const Customer = require("../models/customer.model.js");
const CustomerAccount = require("../models/customer_account.model.js");
const EmployeeAccount = require("../models/employee_account.model.js");


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
            message: `ERROR occurred while creating customer: ${err.message}`
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
 * Checks to see if exists an account with given email that belongs to a 
 * customer, then checks if passwords match for that account.
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
        console.log(`ERROR (CustomerAccount.login) ${err.message}`);
        res.status(500).send({
          message: "INTERNAL ERROR"
        });
        return;
      }
    }
    console.log("DEBUG: EMAIL FOUND");
    // account may be employee or customer account.
    // check specifically if a customer exists with this account ID 
    console.log('DEBUG: ', resultAccount);
    CustomerAccount.findByID(resultAccount.AccountID, (err, resultCustomer) => {
      if (resultCustomer) {
        // we have determined that this account belongs to a customer
        //check password
        if (bcrypt.compareSync(req.body.Password, resultAccount.Password)) {
          // passwords match. create token for user
          const token = jwt.sign({
            id: resultAccount.AccountID,
            type: "customer"
          }, "jwtsecretkey");

          // httpOnly means the cookie cannot be accessed directly
          // cookie can only be accessed through API requests
          res.cookie("access_token", token, { 
            httpOnly: true 
          }).status(200).send({
            id: resultAccount.AccountID,
            type: "customer"
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
          console.log(`ERROR (CustomerAccount.login) ${err.message}`);
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
 * First authenticates cookie (checks if cookie ID is same as account ID or
 * if it belongs to an employee with appropriate clearance) and then
 * returns info on customer account with account ID `req.params.AccountID`.
 * 
 * Info returned:
 *  - `FName`
 *  - `LName`
 *  - `PhoneNum`
 *  - `Email`
 *  - `NumPastOrders`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.authGet = (req, res) => {
  console.log('DEBUG: getting customer account info for account ID ', req.params.AccountID);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (customer_account.controller)', err);
      return res.status(403).send({
        message: 'Cookie required to confirm identity is not valid!'
      });
    }

    console.log('DEBUG: cookie has ID ', userInfo.id);

    if (userInfo.id == req.params.AccountID) {
      get(req, res);
    } else {
      // cookie ID does not match account ID
      // check if cookie ID belongs to employee account
      EmployeeAccount.findByID(userInfo.id, (err, eAccount) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(403).send({
              message: 'You do not have the right to access the account you are tring to access!'
            });
          }
          console.log('ERROR (customer_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }

        if (eAccount.PermissionLevel < 2) {
          return res.status(403).send({
            message: 'You do not have sufficient permissions to access any accounts but your own!'
          });
        }

        get(req, res);
      })
    }
    
  });
}

const get = (req, res) => {
  // find CUSTOMER_ACCOUNT corresponding to this ID
  CustomerAccount.findByID(req.params.AccountID, (err, cAccount) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: 'Account could not be found!'
        });
      }
      console.log('ERROR (customer_account.controller)', err);
      return res.status(500).send({
        message: 'INTERNAL ERROR'
      });
    }
    // find CUSTOMER corresponding to retrieved phone number
    Customer.findByPhone(cAccount.Customer, (err, customer) => {
      if (err) {
        console.log('ERROR (customer_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }
      // find ACCOUNT corresponding to this ID
      Account.findByID(req.params.AccountID, (err, account) => {
        if (err) {
          console.log('ERROR (customer_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }
        const data = {
          FName: customer.FName,
          LName: customer.LName,
          PhoneNum: customer.PhoneNum,
          Email: account.Email,
          NumPastOrders: cAccount.NumPastOrders
        }
        console.log(
          `customer account with ID ${req.params.AccountID} retrieved:`,
          data  
        )
        // return all info
        return res.status(200).send({ ...data });
      })
    })
  });
}


/**
 * First authenticates cookie (checks if cookie ID belongs to an employee with
 * appropriate clearance) and then returns info on all customer accounts.
 * 
 * Info returned for each customer account:
 *  - `AccountID`
 *  - `FName`
 *  - `LName`
 *  - `PhoneNum`
 *  - `Email`
 *  - `NumPastOrders`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.authGetAll = (req, res) => {
  console.log('DEBUG: getting customer account info for all accounts');
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (customer_account.controller)', err);
      return res.status(403).send({
        message: 'Cookie required to confirm identity is not valid!'
      });
    }

    console.log('DEBUG: cookie has ID ', userInfo.id);

    // check if cookie ID belongs to employee account
    EmployeeAccount.findByID(userInfo.id, (err, eAccount) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(403).send({
            message: 'You do not have the right to access the account you are tring to access!'
          });
        }
        console.log('ERROR (customer_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }

      if (eAccount.PermissionLevel < 2) {
        return res.status(403).send({
          message: 'You do not have sufficient permissions to access any accounts but your own!'
        });
      }

      getAll(req, res);
    })
    
  });
}

const getAll = (req, res) => {
  CustomerAccount.getAll((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: 'No accounts to retrieve!'
        });
      }
      console.log('ERROR (customer_account.controller)', err);
      return res.status(500).send({
        message: 'INTERNAL ERROR'
      });
    }
    return res.status(200).send(data);
  });
}


/**
 * First authenticates cookie (checks if cookie ID is same as account ID or
 * if it belongs to an employee with appropriate clearance) and then
 * updates info from `req.body`.
 * 
 * At least one of the following values-to-update must be defined within body:
 *  - `FName`
 *  - `LName`
 *  - `PhoneNum`
 *  - `Email`
 *  - `Password`
 *  - `NumPastOrders`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.authUpdate = (req, res) => {
  // confirm at least one value present.
  if (!(req.body.FName || req.body.LName || req.body.PhoneNum ||
    req.body.Email || req.body.Password || req.body.NumPastOrders)
  ) {
    return res.status(400).send({
      message: 'Cannot request to update no values!'
    });
  }

  console.log('updating customer account info for account ID ', req.params.AccountID);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (customer_account.controller)', err);
      return res.status(403).send({
        message: 'Cookie required to confirm identity is not valid!'
      });
    }

    console.log('DEBUG: cookie has ID ', userInfo.id);

    if (userInfo.id == req.params.AccountID) {
      // user is requesting to update their own account.
      update(req, res);
    } else {
      // cookie ID does not match account ID
      // check if cookie ID belongs to employee account
      EmployeeAccount.findByID(userInfo.id, (err, eAccount) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(403).send({
              message: 'You do not have the right to access the account you are tring to access!'
            });
          }
          console.log('ERROR (customer_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }

        if (eAccount.PermissionLevel < 2) {
          return res.status(403).send({
            message: 'You do not have sufficient permissions to access any accounts but your own!'
          });
        }

        update(req, res);
      })
    }
    
  });
};

const update = (req, res) => {

  if (req.body.FName || req.body.LName || req.body.PhoneNum) {
    // we must change CUSTOMER
    // first, get phone number from customer account
    CustomerAccount.findByID(req.params.AccountID, (err, cAccount) => {
      if (err) {
        if (err.kind == 'not_found') {
          return res.status(404).send({
            message: 'Account could not be found!'
          });
        }
        console.log('ERROR (customer_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }

      // create customer model object
      const customer = new Customer({
        PhoneNum: req.body.PhoneNum,
        FName: req.body.FName,
        LName: req.body.LName
      });
      // use model and retrieved phone number to update customer
      Customer.updateByPhone(cAccount.Customer, customer, (err, data) => {
        if (err) {
          console.log('ERROR (customer_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }
        // no error -- we are done updating customer
      });
    });
  }

  if (req.body.Email || req.body.Password) {
    // create account model object
    const account = new Account({
      Email: req.body.Email,
      Password: req.body.Password
    });
    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.Password, salt);
    account.Password = hash;
    // use model to update account
    Account.update(req.params.AccountID, account, (err, data) => {
      if (err) {
        console.log('ERROR (customer_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }
      // no error -- we are done updating account
    });
  }

  if (req.body.NumPastOrders) {
    // create customer account model object
    // account ID shouldn't be changed, and phone number updates should cascade
    const cAccount = new CustomerAccount({
      AccountID: undefined,
      Customer: undefined,
      NumPastOrders: req.body.NumPastOrders
    })
    // use model to update account
    CustomerAccount.update(req.params.AccountID, cAccount, (err, data) => {
      if (err) {
        console.log('ERROR (customer_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }
      // no error -- we are done updating customer account
    });
  }

  return res.status(200).send({
    message: 'account updated!'
  });
}


/**
 * First authenticates cookie (checks if cookie ID is same as account ID or
 * if it belongs to an employee with appropriate clearance) and then
 * deletes the account
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.authDelete = (req, res) => {
  console.log('deleting customer account ID ', req.params.AccountID);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (customer_account.controller)', err);
      return res.status(403).send({
        message: 'Cookie required to confirm identity is not valid!'
      });
    }

    console.log('DEBUG: cookie has ID ', userInfo.id);

    if (userInfo.id == req.params.AccountID) {
      // user is requesting to delete their own account.
      deleteCAccount(req, res);
    } else {
      // cookie ID does not match account ID
      // check if cookie ID belongs to employee account
      EmployeeAccount.findByID(userInfo.id, (err, eAccount) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(403).send({
              message: 'You do not have the right to access the account you are tring to access!'
            });
          }
          console.log('ERROR (customer_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }

        if (eAccount.PermissionLevel < 2) {
          return res.status(403).send({
            message: 'You do not have sufficient permissions to access any accounts but your own!'
          });
        }

        deleteCAccount(req, res);
      })
    }
    
  });
};


/**
 * Delete customer account with ID given by `req.params.AccountID`
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteCAccount = (req, res) => {
  CustomerAccount.findByID(req.params.AccountID, (err, cAccount) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: 'Account could not be found!'
        });
      }
      console.log('ERROR (customer_account.controller)', err);
      return res.status(500).send({
        message: 'INTERNAL ERROR'
      });
    }

    // use phone retrieved phone number to delete customer
    Customer.remove(cAccount.Customer, (err, data) => {
      if (err) {
        console.log('ERROR (customer_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }
      // customer (and thus customer account) has been deleted!

      Account.remove(req.params.AccountID, (err, data) => {
        if (err) {
          console.log('ERROR (customer_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }
        // account has been deleted!

        console.log(`deleted customer account with ID ${req.params.AccountID}`);
        return res.status(200).send({
          message: 'account deleted!'
        });
      });
    });
  });
};

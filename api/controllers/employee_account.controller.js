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
 * First authenticates cookie (checks if cookie ID is same as account ID or
 * if it belongs to an employee with appropriate clearance) and then
 * returns info on employee account with account ID `req.params.AccountID`.
 * 
 * Info returned:
 *  - `FName`
 *  - `LName`
 *  - `Email`
 *  - `PermissionLevel`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.authGet = (req, res) => {
  console.log('DEBUG: getting employee account info for account ID ', req.params.AccountID);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (employee_account.controller)', err);
      return res.status(403).send({
        message: 'Cookie required to confirm identity is not valid!'
      });
    }

    console.log('DEBUG: cookie has ID ', userInfo.id);

    if (userInfo.id == req.params.AccountID) {
      get(req, res);
    } else {
      // cookie ID does not match account ID
      // get employee to whom it belongs
      EmployeeAccount.findByID(userInfo.id, (err, eAccount) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(404).send({
              message: 'Your account could not be found! Please try logging out and logging in again.'
            });
          }
          console.log('ERROR (employee_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }

        if (eAccount.PermissionLevel < 5) {
          return res.status(403).send({
            message: "You are requesting information from another employee's account but do not have the clearance to do so!"
          });
        }

        get(req, res);
      })
    }
  });
}

const get = (req, res) => {
  // find EMPLOYEE_ACCOUNT corresponding to this ID
  EmployeeAccount.findByID(req.params.AccountID, (err, eAccount) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: 'The requested account could not be found!'
        });
      }
      console.log('ERROR (employee_account.controller)', err);
      return res.status(500).send({
        message: 'INTERNAL ERROR'
      });
    }
    // find ACCOUNT corresponding to this ID
    Account.findByID(req.params.AccountID, (err, account) => {
      if (err) {
        console.log('ERROR (employee_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }
      const data = {
        FName: eAccount.FName,
        LName: eAccount.LName,
        Email: account.Email,
        PermissionLevel: eAccount.PermissionLevel
      }
      console.log(
        `employee account with ID ${req.params.AccountID} retrieved:`,
        data  
      )
      // return all info
      return res.status(200).send({ ...data });
    })
  });
}


/**
 * First authenticates cookie (checks if cookie ID belongs to an employee with
 * appropriate clearance) and then returns info on all employee accounts.
 * 
 * Info returned for each employee account:
 *  - `AccountID`
 *  - `FName`
 *  - `LName`
 *  - `Email`
 *  - `PermissionLevel`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.authGetAll = (req, res) => {
  console.log('DEBUG: getting employee account info for all accounts');
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (employee_account.controller)', err);
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
        console.log('ERROR (employee_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }

      if (eAccount.PermissionLevel < 5) {
        return res.status(403).send({
          message: 'You do not have sufficient permissions to access any employee accounts but your own!'
        });
      }

      getAll(req, res);
    })
    
  });
}

const getAll = (req, res) => {
  EmployeeAccount.getAll((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: 'No accounts to retrieve!'
        });
      }
      console.log('ERROR (employee_account.controller)', err);
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
 *  - `Email`
 *  - `Password`
 *  - `PermissionLevel`
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.authUpdate = (req, res) => {
  // confirm at least one value present.
  if (!(req.body.FName || req.body.LName || req.body.Email ||
    req.body.Password || req.body.PermissionLevel)
  ) {
    return res.status(400).send({
      message: 'Cannot request to update no values!'
    });
  }

  console.log('updating employee account info for account ID ', req.params.AccountID);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (employee_account.controller)', err);
      return res.status(403).send({
        message: 'Cookie required to confirm identity is not valid!'
      });
    }

    console.log('DEBUG: cookie has ID ', userInfo.id);

    if (userInfo.id == req.params.AccountID) {
      // user is requesting to update their own account.
      if (req.body.PermissionLevel) {
        return res.status(403).send({
          message: 'Employees are not permitted to change their own permission levels.'
        })
      }
      update(req, res);
    } else {
      // cookie ID does not match account ID
      // confirm cookie ID belongs to employee account
      EmployeeAccount.findByID(userInfo.id, (err, eAccount) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(403).send({
              message: 'You do not have the right to access the account you are tring to access!'
            });
          }
          console.log('ERROR (employee_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }

        if (eAccount.PermissionLevel < 5) {
          return res.status(403).send({
            message: 'You do not have sufficient permissions to access any employee accounts but your own!'
          });
        }

        update(req, res);
      })
    }
    
  });
};

const update = (req, res) => {

  if (req.body.FName || req.body.LName || req.body.PermissionLevel) {
    // we must change EMPLOYEE_ACCOUNT
    // first, get phone number from customer account
    // create employee account model object
    const eAccount = new EmployeeAccount({
      AccountID: undefined, // account ID should never have to be changed.
      FName: req.body.FName,
      LName: req.body.LName,
      PermissionLevel: req.body.PermissionLevel
    });
    // use model to update employee account
    EmployeeAccount.update(req.params.AccountID, eAccount, (err, data) => {
      if (err) {
        console.log('ERROR (employee_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }
      // no error -- we are done updating employee account
    });
  }

  if (req.body.Email || req.body.Password) {
    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.Password, salt);
    // create account model object
    const account = new Account({
      Email: req.body.Email,
      Password: hash
    });
    // use model to update account
    Account.update(req.params.AccountID, account, (err, data) => {
      if (err) {
        console.log('ERROR (employee_account.controller)', err);
        return res.status(500).send({
          message: 'INTERNAL ERROR'
        });
      }
      // no error -- we are done updating account
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
  console.log('deleting employee account ID ', req.params.AccountID);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send({
    message: 'Missing cookie required to confirm identity!'
  });

  jwt.verify(token, "jwtsecretkey", (err, userInfo) => {
    if (err) {
      console.log('ERROR (employee_account.controller)', err);
      return res.status(403).send({
        message: 'Cookie required to confirm identity is not valid!'
      });
    }

    console.log('DEBUG: cookie has ID ', userInfo.id);

    if (userInfo.id == req.params.AccountID) {
      // user is requesting to delete their own account.
      deleteEAccount(req, res);
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
          console.log('ERROR (employee_account.controller)', err);
          return res.status(500).send({
            message: 'INTERNAL ERROR'
          });
        }

        if (eAccount.PermissionLevel < 5) {
          return res.status(403).send({
            message: 'You do not have sufficient permissions to access any accounts but your own!'
          });
        }

        deleteEAccount(req, res);
      })
    }
    
  });
};


/**
 * Delete employee account with ID given by `req.params.AccountID`
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteEAccount = (req, res) => {
  Account.remove(req.params.AccountID, (err, data) => {
    if (err) {
      console.log('ERROR (employee_account.controller)', err);
      return res.status(500).send({
        message: 'INTERNAL ERROR'
      });
    }
    // account has been deleted!

    console.log(`deleted employee account with ID ${req.params.AccountID}`);
    return res.status(200).send({
      message: 'account deleted!'
    });
  });
  // deletion of ACCOUNT will cascade and also delete EMPLOYEE_ACCOUNT
}

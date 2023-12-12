/**
 * BASED ON tutorial.model.js FROM:
 *    https://www.bezkoder.com/node-js-rest-api-express-mysql/
 */
const sql = require("./db.js");

/**
 * Create employee account model object to interact with EMPLOYEE_ACCOUNT table.
 * 
 * Fields:
 *  - `AccountID`
 *  - `PermissionLevel`
 *  - `FName`
 *  - `LName`
 * 
 * @param {*} eAccount 
 */
const EmployeeAccount = function(eAccount) {
  this.AccountID = eAccount.AccountID;
  this.PermissionLevel = eAccount.PermissionLevel;
  this.FName = eAccount.FName;
  this.LName = eAccount.LName;
};


/**
 * create new EMPLOYEE_ACCOUNT row with given values
 * @param {EmployeeAccount} newAccount EmployeeAccount object with the values to be inserted
 * @param {*} result 
 */
EmployeeAccount.create = (newAccount, result) => {
  sql.query("INSERT INTO employee_account SET ?", newAccount, (err, res) => {
    if (err) {
      console.log("ERROR (EmployeeAccount.create)", err);
      result(err, null);
      return;
    }

    console.log("LOG: created employee account: ", {...newAccount});
    result(null, {newAccount});
  });
};


/**
 * Find EMPLOYEE_ACCOUNT row with given account ID
 * @param {number} queryID account ID to search for
 * @param {*} result returns one account object on success
 */
EmployeeAccount.findByID = (queryID, result) => {
  sql.query(`SELECT * FROM employee_account WHERE AccountID = ${queryID}`, (err, res) => {
    if (err) {
      console.log("ERROR (EmployeeAccount.findByID): ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // only returning first result item because account ID is primary key
      // so there should only be one item
      console.log("Found employee account: ", res[0]);
      result(null, res[0]);
      return;
    }

    // no error but also no items in result:
    // employee account with given account ID not found
    result({ kind: "not_found" }, null);
  });
};


EmployeeAccount.getAll = (result) => {
  sql.query("SELECT * FROM employee_account", (err, res) => {
    if (err) {
      console.log("ERROR (EmployeeAccount.getAll): ", err);
      result(err, null);
      return;
    }

    console.log("All employee accounts: ", res);
    result(null, res);
  });
};


/**
 * Update EMPLOYEE_ACCOUNT row with given queryID (AccountID) to the values in
 * eAccount.
 * 
 * Any undefined values in eAccount are excluded and not updated.
 * Assumes at least one value within eAccount is not undefined.
 * 
 * @param {number} queryID            AccountID of account we wish to update.
 * @param {EmployeeAccount} eAccount  EmployeeAccount object of new values we wish to set.
 * @param {*} result 
 */
EmployeeAccount.update = (queryID, eAccount, result) => {
  // build query
  let q = "UPDATE employee_account SET"
  if (!(eAccount.AccountID === undefined)) {
    q += ` AccountID = ${eAccount.AccountID}`;
    if (
      !(eAccount.PermissionLevel === undefined) ||
      !(eAccount.FName === undefined) ||
      !(eAccount.LName === undefined)
    ) q+= ",";
  }
  if (!(eAccount.PermissionLevel === undefined)) {
    q += ` PermissionLevel = "${eAccount.PermissionLevel}"`;
    if (
      !(eAccount.FName === undefined) ||
      !(eAccount.LName === undefined)
    ) q+= ",";
  }
  if (!(eAccount.FName === undefined)) {
    q += ` FName = "${eAccount.FName}"`;
    if (!(eAccount.LName === undefined)) q+= ",";
  }
  if (!(eAccount.LName === undefined)) {
    q += ` LName = "${eAccount.LName}"`;
  }
  q += ` WHERE AccountID = ${queryID}`;
  // console.log("DEBUG: query generated for update: ", q);
  // send the query to SQL server
  sql.query( q, (err, res) => {
    if (err) {
      console.log("ERROR (EmployeeAccount.update): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // employee with given account ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log(`Updated employee (account ID ${queryID}) on the following values: `, {...eAccount});
    result(null, { "queryID": queryID, ...eAccount });
  });
};


/**
 * Delete EMPLOYEE_ACCOUNT row with given ID
 * @param {number} queryID account ID of account to delete
 * @param {*} result 
 */
EmployeeAccount.remove = (queryID, result) => {
  sql.query("DELETE FROM employee_account WHERE AccountID = ?", queryID, (err, res) => {
    if (err) {
      console.log("ERROR (EmployeeAccount.remove): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // employee with given account ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Deleted employee with account ID ", queryID);
    result(null, res);
  });
};


module.exports = EmployeeAccount;
/**
 * BASED ON tutorial.model.js FROM:
 *    https://www.bezkoder.com/node-js-rest-api-express-mysql/
 */
const sql = require("./db.js");

/**
 * Create customer account model object to interact with CUSTOMER_ACCOUNT table.
 * 
 * Fields:
 *  - `AccountID`
 *  - `Customer` (phone number)
 *  - `NumPastOrders`
 * 
 * @param {*} cAccount 
 */
const CustomerAccount = function(cAccount) {
  this.AccountID = cAccount.AccountID;
  this.Customer = cAccount.Customer;
  this.NumPastOrders = cAccount.NumPastOrders;
};


/**
 * create new CUSTOMER_ACCOUNT row with given values
 * @param {CustomerAccount} newAccount CustomerAccount object with the values to be inserted
 * @param {*} result 
 */
CustomerAccount.create = (newAccount, result) => {
  sql.query("INSERT INTO customer_account SET ?", newAccount, (err, res) => {
    if (err) {
      console.log("ERROR (CustomerAccount.create)", err);
      result(err, null);
      return;
    }

    console.log("LOG: created customer account: ", {...newAccount});
    result(null, {newAccount});
  });
};


/**
 * Find customer account with given account ID
 * @param {number} queryID account ID to search for
 * @param {*} result
 */
CustomerAccount.findByID = (queryID, result) => {
  sql.query(`SELECT * FROM customer_account WHERE AccountID = ${queryID}`, (err, res) => {
    if (err) {
      console.log("ERROR (CustomerAccount.findByID): ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // only returning first result item because account ID is primary key
      // so there should only be one item
      console.log("Found customer account: ", res[0]);
      result(null, res[0]);
      return;
    }

    // no error but also no items in result:
    // customer account with given account ID not found
    result({ kind: "not_found" }, null);
  });
};


/**
 * Find customer account with given phone number
 * @param {*} queryPhoneNum phone number to search for
 * @param {*} result 
 */
CustomerAccount.findByPhone = (queryPhoneNum, result) => {
  sql.query(`SELECT * FROM customer_account WHERE Customer = '${queryPhoneNum}'`, (err, res) => {
    if (err) {
      console.log("ERROR (CustomerAccount.findByPhone): ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // only returning first result item because there should never be more
      // than one. each customer should have only one account, and phone is
      // primary key of customer.
      console.log("Found customer account: ", res[0]);
      result(null, res[0]);
      return;
    }

    // no error but also no items in result:
    // customer account with given phone number not found
    result({ kind: "not_found" }, null);
  });
};


CustomerAccount.getAll = (result) => {
  sql.query("SELECT * FROM customer_account", (err, res) => {
    if (err) {
      console.log("ERROR (CustomerAccount.getAll): ", err);
      result(err, null);
      return;
    }

    console.log("All customer accounts: ", res);
    result(null, res);
  });
};


/**
 * Update CUSTOMER_ACCOUNT row with given queryID (AccountID) to the values in
 * cAccount.
 * 
 * Any undefined values in cAccount are excluded and not updated.
 * Assumes at least one value within cAccount is not undefined.
 * 
 * @param {number} queryID            AccountID of account we wish to update.
 * @param {CustomerAccount} cAccount  CustomerAccount object of new values we wish to set.
 * @param {*} result 
 */
CustomerAccount.update = (queryID, cAccount, result) => {
  // build query
  let q = "UPDATE customer_account SET"
  if (!(cAccount.AccountID === undefined)) {
    q += ` AccountID = ${cAccount.AccountID}`;
    if (!(cAccount.Customer === undefined) || !(cAccount.NumPastOrders === undefined)) q+= ",";
  }
  if (!(cAccount.Customer === undefined)) {
    q += ` Customer = "${cAccount.Customer}"`;
    if (!(cAccount.NumPastOrders === undefined)) q+= ",";
  }
  if (!(cAccount.NumPastOrders === undefined)) {
    q += ` NumPastOrders = "${cAccount.NumPastOrders}"`;
  }
  q += ` WHERE AccountID = ${queryID}`;
  // console.log("DEBUG: query generated for update: ", q);
  // send the query to SQL server
  sql.query( q, (err, res) => {
    if (err) {
      console.log("ERROR (CustomerAccount.update): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // customer with given account ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log(`Updated customer (account ID ${queryID}) on the following values: `, {...cAccount});
    result(null, { "queryPhoneNum": queryID, ...cAccount });
  });
};


/**
 * Delete CUSTOMER_ACCOUNT row with given ID
 * @param {number} queryID account ID of account to delete
 * @param {*} result 
 */
CustomerAccount.remove = (queryID, result) => {
  sql.query("DELETE FROM customer_account WHERE AccountID = ?", queryID, (err, res) => {
    if (err) {
      console.log("ERROR (CustomerAccount.remove): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // customer with given account ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Deleted customer with account ID ", queryID);
    result(null, res);
  });
};


module.exports = CustomerAccount;
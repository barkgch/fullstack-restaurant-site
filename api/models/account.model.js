/**
 * BASED ON tutorial.model.js FROM:
 *    https://www.bezkoder.com/node-js-rest-api-express-mysql/
 */
const sql = require("./db.js");

/**
 * Create account model object to interact with ACCOUNT table.
 * 
 * Fields:
 *  - `Email`
 *  - `Password`
 * 
 * Note: ACCOUNT has AccountID column, but this column is automatically set by
 * MySQL and thus is not part of the model object. Used for querying only.
 * 
 * @param {*} account 
 */
const Account = function(account) {
  this.Email = account.Email;
  this.Password = account.Password;
}


/**
 * Create new ACCOUNT row with given values
 * @param {Account} newAccount Account object with the values to be inserted
 * @param {(err, data)} result Returns generated AccountID in `data` on success
 */
Account.create = (newAccount, result) => {
  sql.query(`INSERT INTO ACCOUNT (Email, Password) VALUES ('${newAccount.Email}', '${newAccount.Password}')`, (err, res) => {
    if (err) {
      console.log("ERROR (Account.create): ", err);
      result(err, null);
      return;
    }

    console.log("Created account: ", {...newAccount});
  });
  // get the auto-generated ID
  sql.query("SELECT LAST_INSERT_ID()", (err, res) => {
    if (err) {
      console.log(`ERROR (Account.create): ${err.message}`);
      result(err, null);
      return;
    }
    console.log("Created account's ID: ", res[0]["LAST_INSERT_ID()"]);
    result(null, res[0]["LAST_INSERT_ID()"]);
  });
};


/**
 * Get ACCOUNT row with given account ID
 * @param {number} queryID account ID to search for
 * @param {*} result
 */
Account.findByID = (queryID, result) => {
  sql.query(`SELECT * FROM account WHERE AccountID = ${queryID}`, (err, res) => {
    if (err) {
      console.log("ERROR (Account.findByID): ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // only returning first result item because account ID is primary key
      // so there should only be one item
      console.log("Found account: ", res[0]);
      result(null, res[0]);
      return;
    }

    // no error but also no items in result:
    // account with given account ID not found
    result({ kind: "not_found" }, null);
  });
};


/**
 * Find ACCOUNT row with given email
 * @param {*} queryEmail email to search for
 * @param {*} result 
 */
Account.findByEmail = (queryEmail, result) => {
  sql.query(`SELECT * FROM account WHERE Email = '${queryEmail}'`, (err, res) => {
    if (err) {
      console.log("ERROR (Account.findByEmail): ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // only returning first result item because there should never be more
      // than one. each customer should have only one account, and phone is
      // primary key of customer.
      console.log("Found accounts: ", res[0]);
      result(null, res[0]);
      return;
    }

    // no error but also no items in result:
    // customer account with given phone number not found
    result({ kind: "not_found" }, null);
  });
};


/**
 * Get a list of account IDs and emails (but not passwords)
 * of all rows of ACCOUNT
 * @param {*} result 
 */
Account.getAll = (result) => {
  sql.query("SELECT AccountID, Email FROM account", (err, res) => {
    if (err) {
      console.log("ERROR (Account.getAll): ", err);
      result(err, null);
      return;
    }

    console.log("All accounts: ", res);
    result(null, res);
  });
};


/**
 * Update ACCOUNT row with given queryID (AccountID) to the values in account.
 * 
 * Any undefined values in account are excluded and not updated.
 * Assumes at least one value within account is not undefined.
 * 
 * @param {number} queryID    AccountID of account we wish to update.
 * @param {Account} cAccount  Account object of new values we wish to set.
 * @param {*} result 
 */
Account.update = (queryID, account, result) => {
  // build query
  let q = "UPDATE account SET"
  if (!(account.Email === undefined)) {
    q += ` Email = "${account.Email}"`;
    if (!(account.Password === undefined)) q+= ",";
  }
  if (!(account.Password === undefined)) {
    q += ` Password = "${account.Password}"`;
  }
  q += ` WHERE AccountID = ${queryID}`;
  // console.log("DEBUG: query generated for update: ", q);
  // send the query to SQL server
  sql.query( q, (err, res) => {
    if (err) {
      console.log("ERROR (Account.update): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // account with given account ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log(`Updated account (account ID ${queryID}) on the following values: `, {...account});
    result(null, { "queryPhoneNum": queryID, ...account });
  });
};


/**
 * Delete ACCOUNT row with given ID
 * @param {number} queryID account ID of account to delete
 * @param {*} result 
 */
Account.remove = (queryID, result) => {
  sql.query("DELETE FROM account WHERE AccountID = ?", queryID, (err, res) => {
    if (err) {
      console.log("ERROR (Account.remove): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // account with given account ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Deleted account with account ID ", queryID);
    result(null, res);
  });
};


module.exports = Account;
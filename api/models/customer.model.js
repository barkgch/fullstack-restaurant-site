/**
 * BASED ON tutorial.model.js FROM:
 *    https://www.bezkoder.com/node-js-rest-api-express-mysql/
 */
const sql = require("./db.js");

/**
 * Create customer model object to interact with CUSTOMER table.
 * 
 * Fields:
 *  - `PhoneNum`
 *  - `FName`
 *  - `LName`
 * 
 * @param {*} customer 
 */
const Customer = function(customer) {
  this.PhoneNum = customer.PhoneNum;
  this.FName = customer.FName;
  this.LName = customer.LName;
};


Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO customer SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", {...newCustomer});
    result(null, {newCustomer});
  });
};


Customer.findByPhone = (queryPhoneNum, result) => {
  sql.query(`SELECT * FROM customer WHERE PhoneNum = ${queryPhoneNum}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // customer with given phone number not found
    result({ kind: "not_found" }, null);
  });
};


Customer.getAll = (result) => {
  sql.query("SELECT * FROM customer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("all customers: ", res);
    result(null, res);
  });
};


Customer.updateByPhone = (queryPhoneNum, customer, result) => {
  // put together query.
  // only include the columns for which a value has been provided
  // (do not update values that have not beed requested to be updated).
  // controller should ensure that at least one of these is not null.
  console.log("customer object recieved: ", customer);

  let q = "UPDATE customer SET"
  if (!(customer.PhoneNum === undefined)) q += ` PhoneNum = ${customer.PhoneNum}`;
  if (!(customer.PhoneNum === undefined) && !(customer.FName === undefined)) q+= ",";
  if (!(customer.FName === undefined))    q += ` FName = "${customer.FName}"`;
  if (!(customer.FName === undefined) && !(customer.LName === undefined)) q+= ",";
  if (!(customer.LName === undefined))    q += ` LName = "${customer.LName}"`;
  q += ` WHERE PhoneNum = ${queryPhoneNum}`;
  console.log("query generated for update: ", q);
  // send the query to SQL server
  sql.query(
    q,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // customer with given PhoneNum not found
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(`Updated customer (phone number ${queryPhoneNum}) on the following values: `, {...customer});
      result(null, { "queryPhoneNum": queryPhoneNum, ...customer });
    }
  );
};


Customer.remove = (queryPhoneNum, result) => {
  sql.query("DELETE FROM customer WHERE PhoneNum = ?", queryPhoneNum, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // customer with given PhoneNum not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with PhoneNum: ", queryPhoneNum);
    result(null, res);
  });
};


Customer.removeAll = result => {
  sql.query("DELETE FROM customer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} customers`);
    result(null, res);
  });
};


module.exports = Customer;
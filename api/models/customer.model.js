const sql = require("./db.js");

// constructor
const Customer = function(customer) {
  this.phoneNum = customer.phoneNum;
  this.fName = customer.fName;
  this.lName = customer.lName;
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


Customer.findByPhone = (phoneNum, result) => {
  sql.query(`SELECT * FROM customer WHERE PhoneNum = ${phoneNum}`, (err, res) => {
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

    // customer with given ID not found
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


Customer.updateByPhone = (phoneNum, customer, result) => {
  // put together query.
  // only include the columns for which a value has been provided
  // (do not update values that have not beed requested to be updated).
  // controller should ensure that at least one of these is not null.
  console.log("customer object recieved: ", customer);

  let q = "UPDATE customer SET"
  if (!(customer.phoneNum === undefined)) q += ` PhoneNum = ${customer.phoneNum}`;
  if (!(customer.phoneNum === undefined) && !(customer.fName === undefined)) q+= ",";
  if (!(customer.fName === undefined))    q += ` FName = "${customer.fName}"`;
  if (!(customer.fName === undefined) && !(customer.lName === undefined)) q+= ",";
  if (!(customer.lName === undefined))    q += ` LName = "${customer.lName}"`;
  q += ` WHERE PhoneNum = ${phoneNum}`;
  console.log("query generated for update: ", q);
  // actually make the query
  sql.query(
    // "UPDATE customer SET PhoneNum = ?, FName = ?, LName = ? WHERE PhoneNum = ?",
    q,
    // [customer.phoneNum, customer.fName, customer.lName, phoneNum],
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

      console.log(`Updated customer (phone number ${phoneNum}) on the following values: `, {...customer});
      // console.log("Updated customer with phone number : ", { "phoneNum": phoneNum, ...customer });
      result(null, { "phoneNum": phoneNum, ...customer });
    }
  );
};


Customer.remove = (phoneNum, result) => {
  sql.query("DELETE FROM customer WHERE PhoneNum = ?", phoneNum, (err, res) => {
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

    console.log("deleted customer with PhoneNum: ", phoneNum);
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
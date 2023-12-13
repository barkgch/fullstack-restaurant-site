const sql = require("./db.js");

const Location = function (location) {
  this.Name = location.Name;
  this.Email = location.Email;
  this.PhoneNum = location.PhoneNum;
  this.Street = location.Street;
  this.City = location.City;
  this.Province = location.Province;
  this.Postal = location.Postal;
};

Location.getAll = (result) => {
  sql.query("SELECT * FROM LOCATION", (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }
    console.log("Locations: ", res);
    result(null, res);
  });
};

Location.getDistinguish = (result) => {
  sql.query(
    "SELECT Name, Postal, Street, City, Province FROM LOCATION",
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
      console.log("Location Names: ", res);
      result(null, res);
    }
  );
};

module.exports = Location;

const sql = require("./db.js");

const SpecialReservation = function (special_reservation) {
  this.Customer = special_reservation.Customer;
  this.Location = special_reservation.Location;
  this.Description = special_reservation.Description;
  this.TimePlaced = special_reservation.TimePlaced;
  this.TimeRequested = special_reservation.TimeRequested; // Corrected property name
};

SpecialReservation.create = (newSpecialReservation, result) => {
  sql.query(
    "INSERT INTO SP_EVENT_INQUIRY (Customer, Location, Description, TimePlaced, TimeRequested) VALUES (?, ?, ?, ?, ?)",
    [
      newSpecialReservation.Customer,
      newSpecialReservation.Location,
      newSpecialReservation.Description,
      newSpecialReservation.TimePlaced,
      newSpecialReservation.TimeRequested,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created special reservation: ", {
        id: res.insertId,
        ...newSpecialReservation,
      });
      result(null, { id: res.insertId, ...newSpecialReservation });
    }
  );
};

SpecialReservation.findByLocation = (location, result) => {
  sql.query(
    `SELECT * FROM SP_EVENT_INQUIRY WHERE Location = ?`,
    location,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found special reservations: ", res);
        result(null, res);
        return;
      }

      // No special reservations found for the location
      result(null, []);
    }
  );
};
module.exports = SpecialReservation;

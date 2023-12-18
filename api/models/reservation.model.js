const sql = require("./db.js");

const Reservation = function (reservation) {
  this.customer = reservation.customer;
  this.numPeople = reservation.numPeople;
  this.location = reservation.location;
  this.type = reservation.type;
  this.datetime = reservation.datetime;
};

Reservation.create = (newReservation, result) => {
  console.log("reservation: ", newReservation);
  sql.query(
    "INSERT INTO RESERVATION (Customer, NumPeople, Location, Type, DateTime) VALUES (?, ?, ?, ?, ?)",
    [
      newReservation.customer,
      newReservation.numPeople,
      newReservation.location,
      newReservation.type,
      newReservation.datetime,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created reservation: ", {
        id: res.insertId,
        ...newReservation,
      });
      result(null, { id: res.insertId, ...newReservation });
    }
  );
};

// Get all reservations
Reservation.getAll = (result) => {
  sql.query("SELECT * FROM RESERVATION", (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    console.log("Reservations: ", res);
    result(null, res);
  });
};

// Get reservation by customer phone number
Reservation.getByPhone = (phone, result) => {
  sql.query(
    "SELECT * FROM RESERVATION WHERE Customer = ?",
    phone,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      console.log("Reservation by phone: ", res);
      result(null, res);
    }
  );
};

// Update a reservation by customer email and datetime
Reservation.updateByCustomerAndDatetime = (
  customerEmail,
  datetime,
  updatedReservation,
  result
) => {
  sql.query(
    "UPDATE RESERVATION SET ? WHERE Customer = ? AND Datetime = ?",
    [updatedReservation, customerEmail, datetime],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        // No reservation found with the given customer and datetime
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Updated reservation: ", { ...updatedReservation });
      result(null, { ...updatedReservation });
    }
  );
};

Reservation.getByLocationAndCustomerAndDateTime = (
  location,
  customer,
  dateTime,
  result
) => {
  sql.query(
    "SELECT * FROM RESERVATION WHERE Location = ? AND Customer = ? AND DateTime = ?",
    [location, customer, dateTime],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Reservation.getByLocation = (location, result) => {
  sql.query(
    "SELECT * FROM RESERVATION WHERE Location = ?",
    location,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Reservation.getAllTimesForLocation = (result) => {
  sql.query(
    "SELECT DateTime FROM RESERVATION WHERE Location = ?",
    location,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Reservation.getReservationsByLocationDate = (location, DateTime, result) => {
  sql.query(
    "SELECT * FROM RESERVATION WHERE Location = ? and DateTime = ?",
    [location, DateTime], // Use lowercase variables here
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Reservation.deleteByCustomerAndDatetime = (customerEmail, datetime, result) => {
  sql.query(
    "DELETE FROM RESERVATION WHERE Customer = ? AND DateTime = ?",
    [customerEmail, datetime],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        // No reservation found with the given customer and datetime
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Deleted RESERVATION for customer and datetime: ", {
        customerEmail,
        datetime,
      });
      result(null, res);
    }
  );
};

module.exports = Reservation;

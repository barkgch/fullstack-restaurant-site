const sql = require("./db.js");

const Reservation = function (reservation) {
  this.customer = reservation.customer;
  this.numPeople = reservation.numPeople;
  this.location = reservation.location;
  this.type = reservation.type;
  this.datetime = reservation.datetime;
};

Reservation.update = (updatedReservation, previousReservation, result) => {
  console.log("update: ", updatedReservation);
  sql.query(
    "UPDATE RESERVATION SET Customer = ?, NumPeople = ?, Location = ?, Type = ?, DateTime = ? WHERE Customer = ? AND Location = ? AND DateTime = ?",
    [
      updatedReservation.Customer,
      updatedReservation.numPeople,
      updatedReservation.Location,
      updatedReservation.Type,
      updatedReservation.DateTime,
      previousReservation.Customer,
      previousReservation.Location,
      previousReservation.DateTime,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null); // Use callback to return error
        return;
      }

      if (res.affectedRows === 0) {
        console.log("No reservation found with specified criteria to update.");
        result({ kind: "not_found" }, null); // Use callback for not found
        return;
      }

      console.log("updated reservation: ", { ...updatedReservation });
      result(null, { ...updatedReservation }); // Use callback for success
    }
  );
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

Reservation.getReservationsByCustomerLocationDate = (
  customer,
  location,
  datetime,
  result
) => {
  sql.query(
    "SELECT * FROM RESERVATION WHERE Location = ? AND Customer = ? AND DateTime = ?",
    [location, customer, datetime],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
      // Check if any rows were returned from the query
      if (res.length === 0) {
        console.log("No reservation found.");
        result(null, null);
        return;
      }
      // Log the reservation
      console.log("Reservation: ", res[0]);
      // Pass the reservation as well
      result(null, res[0]);
    }
  );
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
    "SELECT DateTime FROM RESERVATION WHERE Location = ? ORDER BY TimeRequested ASC",
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
    [location, DateTime],
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

Reservation.deleteReservation = (customer, location, datetime, result) => {
  console.log(customer, location, datetime);
  sql.query(
    "DELETE FROM RESERVATION WHERE Customer = ? AND Location = ? AND DateTime = ?",
    [customer, location, datetime],
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
        customer,
        datetime,
      });
      result(null, res);
    }
  );
};

module.exports = Reservation;

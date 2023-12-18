const Reservation = require("../models/reservation.model");

exports.createReservation = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Update attribute names to match the database column names
  const newReservation = new Reservation({
    customer: req.body.Customer,
    numPeople: req.body.NumPeople,
    location: req.body.Location,
    type: req.body.Type,
    datetime: req.body.DateTime,
  });

  console.log("cont: ", newReservation);

  Reservation.create(newReservation, (err, data) => {
    console.log("data: ", newReservation);
    if (err) {
      res.status(500).send({
        message:
          err.message || "Error occurred while creating the reservation.",
      });
    } else res.send(data);
  });
};

exports.getAllReservations = (req, res) => {
  Reservation.getAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Error occurred while retrieving reservations.",
      });
    }
    res.json(data);
  });
};

exports.getAllTimesForLocation = (req, res) => {
  Reservation.getAllTimesForLocation((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Error occurred while retrieving reservations.",
      });
    }
    res.json(data);
  });
};

exports.getReservationByPhone = (req, res) => {
  const phone = req.params.phone;

  Reservation.getByPhone(phone, (err, data) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message ||
          `Error occurred while retrieving reservation for phone: ${phone}.`,
      });
    }
    res.json(data);
  });
};

exports.updateReservation = (req, res) => {
  const { customerEmail, datetime } = req.params;
  const updatedReservation = req.body;

  Reservation.updateByCustomerAndDatetime(
    customerEmail,
    datetime,
    updatedReservation,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `No reservation found for customer: ${customerEmail} and datetime: ${datetime}.`,
          });
        }
        return res.status(500).send({
          message:
            err.message ||
            `Error updating reservation for customer: ${customerEmail} and datetime: ${datetime}.`,
        });
      }
      res.json(data);
    }
  );
};

exports.getReservationsByLocation = (req, res) => {
  const location = req.params.location;

  Reservation.getByLocation(location, (err, data) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message ||
          `Error occurred while retrieving reservations for location: ${location}.`,
      });
    }
    res.json(data);
  });
};

exports.getReservationsByLocationDate = (req, res) => {
  const location = req.params.location; // Use lowercase "location"
  const dateTime = req.params.dateTime; // Corrected to "dateTime"

  Reservation.getByLocationAndCustomerAndDateTime(
    location,
    customer,
    dateTime,
    (err, data) => {
      if (err) {
        return res.status(500).send({
          message:
            err.message ||
            `Error occurred while retrieving reservations for location: ${location}.`,
        });
      }
      res.json(data);
    }
  );
};

exports.deleteReservation = (req, res) => {
  const { customerEmail, datetime } = req.params;

  Reservation.deleteByCustomerAndDatetime(
    customerEmail,
    datetime,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `No reservation found for customer: ${customerEmail} and datetime: ${datetime}.`,
          });
        }
        return res.status(500).send({
          message:
            err.message ||
            `Error deleting reservation for customer: ${customerEmail} and datetime: ${datetime}.`,
        });
      }
      res.send({
        message: `Reservation deleted successfully for customer: ${customerEmail} and datetime: ${datetime}`,
      });
    }
  );
};

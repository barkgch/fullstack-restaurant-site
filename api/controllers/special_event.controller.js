const SpecialReservation = require("../models/special_reservation.model.js");

// Create and Save a new Special Reservation
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a SpecialReservation
  const specialReservation = new SpecialReservation({
    Customer: req.body.Customer,
    Location: req.body.Location,
    Description: req.body.Description,
    TimePlaced: req.body.TimePlaced,
    TimeRequested: req.body.TimeRequested,
  });

  // Save SpecialReservation in the database
  SpecialReservation.create(specialReservation, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Special Reservation.",
      });
    else res.send(data);
  });
};

// Find a Special Reservation by Location
exports.findByLocation = (req, res) => {
  SpecialReservation.findByLocation(req.params.location, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Special Reservation with location ${req.params.location}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving Special Reservation with location " +
            req.params.location,
        });
      }
    } else res.send(data);
  });
};

// Additional methods like update, delete, etc., can be implemented similarly

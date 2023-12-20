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
exports.updateReservation = (req, res) => {
  const { updatedReservation, previousReservation } = req.body;

  Reservation.update(updatedReservation, previousReservation, (err, data) => {
    if (err) {
      // Check if the error is related to a foreign key constraint
      if (
        err.code === "ER_NO_REFERENCED_ROW" ||
        err.code === "ER_NO_REFERENCED_ROW_2"
      ) {
        res.status(400).send({
          message:
            "Invalid customer reference. Please check the customer details.",
        });
      } else {
        res.status(500).send({
          message:
            err.message || "Error occurred while updating the reservation.",
        });
      }
    } else if (!data) {
      // Handle case where no reservation was found to update
      res.status(404).send({ message: "No reservation found to update." });
    } else {
      // Send success response
      res.send(data);
    }
  });
};

exports.getReservationsByCustomerLocationDate = (req, res) => {
  Reservation.getReservationsByCustomerLocationDate(
    req.params.Customer,
    req.params.Location,
    req.params.Datetime,
    (err, data) => {
      if (err) {
        console.log("Error:", err); // Log the error for debugging
        return res.status(500).send({
          message:
            err.message || "Error occurred while retrieving reservations.",
        });
      }

      res.json(data);
    }
  );
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

// exports.getReservationsByLocationDate = (req, res) => {
//   const location = req.params.location; // Use lowercase "location"
//   const dateTime = req.params.dateTime; // Corrected to "dateTime"

//   Reservation.getByLocationAndCustomerAndDateTime(
//     location,
//     customer,
//     dateTime,
//     (err, data) => {
//       if (err) {
//         return res.status(500).send({
//           message:
//             err.message ||
//             `Error occurred while retrieving reservations for location: ${location}.`,
//         });
//       }
//       res.json(data);
//     }
//   );
// };

//delete reservation

exports.deleteReservation = (req, res) => {
  console.log("Received parameters - Customer:", req.params.Customer);
  console.log("Received parameters - Location:", req.params.Location);
  console.log("Received parameters - Datetime:", req.params.Datetime);

  Reservation.deleteReservation(
    req.params.Customer,
    req.params.Location,
    req.params.Datetime,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          console.log("Reservation not found in the database.");
          return res.status(404).send({
            message: `No reservation found for customer: ${req.params.Customer} and datetime: ${req.params.Datetime}.`,
          });
        }
        console.log("Error deleting reservation:", err);
        return res.status(500).send({
          message:
            err.message ||
            `Error deleting reservation for customer: ${req.params.Customer} and datetime: ${req.params.Datetime}.`,
        });
      }
      console.log("Reservation deleted successfully:", data);
      res.json(data);
    }
  );
};

module.exports = (app) => {
  const express = require("express");
  var router = express.Router();

  const specialReservationsController = require("../controllers/special_event.controller");

  // Create a new Special Reservation
  router.post("/", specialReservationsController.create);

  // Retrieve a Special Reservation by Location
  router.get(
    "/location/:location",
    specialReservationsController.findByLocation
  );

  app.use("/api/specialRes", router);
};

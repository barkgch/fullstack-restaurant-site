module.exports = (app) => {
  const express = require("express");
  var router = express.Router();

  const Reservation = require("../controllers/reservation.controller");

  router.post("", (req, res) => {
    console.log("Request body:", req.body); // Log the request body
    Reservation.createReservation(req, res);
  });

  router.get("/all", Reservation.getAllReservations);

  router.get("/phone/:phone", Reservation.getReservationByPhone);

  router.put("/update/:customerEmail/:dateTime", Reservation.updateReservation);

  router.delete(
    "/delete/:customerEmail/:dateTime",
    Reservation.deleteReservation
  );

  router.get("/location/:location", Reservation.getReservationsByLocation);

  router.get("/times/:location", Reservation.getAllTimesForLocation);

  router.get("/:location/:dateTime", Reservation.getReservationsByLocationDate);

  app.use("/api/reservation", router);
};

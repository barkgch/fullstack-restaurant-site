module.exports = (app) => {
  const express = require("express");
  var router = express.Router();

  const Reservation = require("../controllers/reservation.controller");

  router.post("", (req, res) => {
    console.log("Request body:", req.body); // Log the request body
    Reservation.createReservation(req, res);
  });

  router.post("/update", (req, res) => {
    // Pass them as separate arguments to the updateReservation function
    Reservation.updateReservation(req, res);
  });

  router.get("/all", Reservation.getAllReservations);

  router.get("/phone/:phone", Reservation.getReservationByPhone);

  router.put("/update/:customerEmail/:dateTime", Reservation.updateReservation);

  router.delete(
    "/delete/:Customer/:Location/:Datetime",
    Reservation.deleteReservation
  );

  router.get(
    "/update/get/:Customer/:Location/:Datetime",
    Reservation.getReservationsByCustomerLocationDate
  );

  router.get("/location/:location", Reservation.getReservationsByLocation);

  router.get("/times/:location", Reservation.getAllTimesForLocation);

  // router.get("/:location/:dateTime", Reservation.getReservationsByLocationDate);

  app.use("/api/reservation", router);
};

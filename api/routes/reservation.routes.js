module.exports = (app) => {
  const Reservation = require("../controllers/reservation.controller");
  var router = require("express").Router();

  router.post("/", Reservation.createReservation);

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

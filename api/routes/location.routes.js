module.exports = (app) => {
  const Location = require("../controllers/location.controller");
  var router = require("express").Router();

  // Route to get all locations
  router.get("/all", Location.getAllLocation);

  // Route to get all location names
  router.get("/names", Location.getDistinguish);

  // Use the router for the '/api/location' path
  app.use("/api/location", router);
};

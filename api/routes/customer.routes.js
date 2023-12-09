module.exports = app => {
  const customer = require("../controllers/customer.controller.js");
  
  var router = require("express").Router();

  // Create a new customer
  router.post("/", customer.create);

  // Retrieve all customers
  router.get("/", customer.findAll);

  // Retrieve a single customer with PhoneNum
  router.get("/:PhoneNum", customer.findOne);

  // Update a customer with PhoneNum
  router.put("/:PhoneNum", customer.update);

  // Delete a customer with PhoneNum
  router.delete("/:PhoneNum", customer.delete);

  // Delete all customers
  router.delete("/", customer.deleteAll);

  app.use('/api/customer', router);
};
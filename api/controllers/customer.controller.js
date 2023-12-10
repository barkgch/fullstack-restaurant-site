/**
 * BASED ON tutorial.controller.js FROM:
 *    https://www.bezkoder.com/node-js-rest-api-express-mysql/
 */
const Customer = require("../models/customer.model.js");


// Create and Save a new customer
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }
  // create customer model object
  const customer = new Customer({
    PhoneNum: req.body.PhoneNum,
    FName: req.body.FName,
    LName: req.body.LName
  });

  // use model to save customer info in database
  Customer.create(customer, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while creating customer."
      });
    } else res.send(data);
  });
};


// Retrieve all customers from the database (does not accept conditions)
exports.findAll = (req, res) => {
  Customer.getAll( (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving all customers."
      });
    } else res.send(data);
  })
};

// Find a single customer with a PhoneNum
exports.findOne = (req, res) => {
  Customer.findByPhone(req.params.PhoneNum, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found customer with PhoneNum ${req.params.PhoneNum}.`
        });
      } else {
        res.status(500).send({
          message: err.message || "An error occurred while retrieving customer with PhoneNum " + req.params.PhoneNum
        });
      }
    } else res.send(data);
  });
};

// Update a customer identified by the PhoneNum in the request
exports.update = (req, res) => {
  // validate body contents
  if (!req.body) {
    res.status(400).send({
      message: "Customer update request issue: request content cannot be empty!"
    });
  } else if (!(req.body.PhoneNum || req.body.FName || req.body.LName)) {
    res.status(400).send({
      message: "Customer update request issue: at least one of the customer fields must be provided!"
    });
  }

  console.log(req.body);

  Customer.updateByPhone(
    req.params.PhoneNum,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found customer with PhoneNum ${req.params.PhoneNum}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating customer with PhoneNum " + req.params.PhoneNum
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a customer with the specified phoneNum in the request
exports.delete = (req, res) => {
  Customer.remove(req.params.PhoneNum, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found customer with PhoneNum ${req.params.PhoneNum}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete customer with PhoneNum " + req.params.PhoneNum
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

// Delete all customers from the database.
exports.deleteAll = (req, res) => {
  Customer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers."
      });
    else res.send({ message: `All customers were deleted successfully!` });
  });
};

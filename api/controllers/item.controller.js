const Item = require('../models/item.model.js');

// Create and Save a new Item
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create an Item
  const item = new Item({
    ItemID: req.body.itemId,
    Name: req.body.Name,
    Description: req.body.Description,
    Picture: req.body.Picture,
    Price: req.body.Price
  });

  // Save Item in the database
  Item.create(item, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Item."
      });
    else res.send(data);
  });
};

// Retrieve all Items from the database
exports.findAll = (req, res) => {
  Item.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving items."
      });
    else res.send(data);
  });
};

// Find a single Item with a itemId
exports.findOne = (req, res) => {
  Item.findById(req.params.itemId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Item with id ${req.params.itemId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Item with id " + req.params.itemId
        });
      }
    } else res.send(data);
  });
};

// Update an Item identified by the itemId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  } else if (!(req.body.Name || req.body.Description || req.body.Picture || req.body.Price)) {
    res.status(400).send({
      message: "Customer update request issue: at least one of the customer fields must be provided!"
    });
  }

  console.log(req.body);

  Item.updateById(
    req.params.itemId,
    new Item(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Item with id ${req.params.itemId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Item with id " + req.params.itemId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete an Item with the specified itemId in the request
exports.delete = (req, res) => {
  Item.remove(req.params.itemId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Item with id ${req.params.itemId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Item with id " + req.params.itemId
        });
      }
    } else res.send({ message: `Item was deleted successfully!` });
  });
};

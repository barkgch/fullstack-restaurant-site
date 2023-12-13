const Location = require("../models/location.model");

exports.getAllLocation = (req, res) => {
  Location.getAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Error occurred while retrieving locations.",
      });
    }
    res.json(data);
  });
};

exports.getDistinguish = (req, res) => {
  Location.getDistinguish((err, data) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message || "Error occurred while retrieving location names.",
      });
    }
    res.json(data);
  });
};

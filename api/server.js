const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// set CORS. this allows frontend server to send request to this backend,
// despite the backend being hosted on a different domain.
var corsOptions = {
  // origin should be where frontend server is running
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000"
};
app.use(cors(corsOptions));

// parsers for parsing requests
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// for testing
app.get("/", (req, res) => {
  res.json({message: "Welcome to backend server"});
});

const routes = require("./routes/customer.routes.js")(app);

// set port to listen for requests on
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
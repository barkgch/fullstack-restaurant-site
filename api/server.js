const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
require("dotenv").config();

const app = express();

// set CORS. this allows frontend server to send request to this backend,
// despite the backend being hosted on a different domain.
var corsOptions = {
  // credentials must be enabled to work with Axios's withCredentials option
  // in the frontend, in order to allow cookie passing
  credentials: true,
  // origin should be where frontend server is running
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000"
};
app.use(cors(corsOptions));

// parsers for parsing requests
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// for creating cookies
app.use(cookieParser());

// for testing
app.get("/", (req, res) => {
  res.json({message: "Welcome to backend server"});
});

require("./routes/customer.routes.js")(app);
require("./routes/account.routes.js")(app);
require("./routes/location.routes.js")(app);
require("./routes/reservation.routes.js")(app);
require("./routes/special_reservation.routes.js")(app);

// set port to listen for requests on
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const express = require("express");
const cors = require("cors");

const app = express();

// set CORS. this allows frontend server to send request to this backend,
// despite the backend being hosted on a different domain.
var corsOptions = {
  origin: "http://localhost:8801" // this should be where frontend server is running
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
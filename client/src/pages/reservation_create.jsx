import React, { useState, useEffect } from "react";
import ReservationDataService from "../services/reservation.service";
import LocationDataService from "../services/location.service";

const AddReservation = () => {
  const [inputs, setInputs] = useState({
    Customer: "",
    Location: "", // Changed to "Location"
    numPeople: "",
    type: "Regular",
    date: "",
    time: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    LocationDataService.getDistinguish()
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  const validateInput = (input) => {
    const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number format
    if (!input.Customer || !phoneRegex.test(input.Customer)) {
      throw new Error("Please enter a valid 10-digit phone number!");
    }
    if (!input.Location) {
      // Changed to "Location"
      throw new Error("Please select a location!");
    }
    if (!input.numPeople || isNaN(input.numPeople) || input.numPeople <= 0) {
      throw new Error("Please enter a valid number of people!");
    }
    if (!input.date) {
      throw new Error("Please select a date!");
    }
    if (!input.time) {
      throw new Error("Please select a time!");
    }
    const convertTo24HourFormat = (time12h) => {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }
      return `${hours}:${minutes}`;
    };

    if (input.time) {
      const time24h = convertTo24HourFormat(input.time);
      if (time24h < "09:00" || time24h > "22:00") {
        throw new Error("Please select a time between 9:00 AM and 10:00 PM!");
      }
    } else {
      throw new Error("Please select a time!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    console.log(name, value, inputs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Combine the date and time for DateTime
    const dateTime = `${inputs.date} ${inputs.time}:00`;

    // Extract the selected location's postal code
    const selectedLocation = locations.find(
      (location) => location.Postal === inputs.Location // Changed to "Location"
    );

    if (!selectedLocation) {
      setError("Please select a valid location.");
      return;
    }

    const fullReservationData = {
      Customer: inputs.Customer,
      Location: selectedLocation.Postal,
      NumPeople: inputs.numPeople,
      Type: inputs.type,
      DateTime: dateTime,
    };

    try {
      await ReservationDataService.createReservation(fullReservationData);
      setError("Reservation created successfully!");
      setInputs({
        Customer: "",
        Location: "",
        numPeople: "",
        type: "Regular",
        date: "",
        time: "",
      });
    } catch (error) {
      setError("Failed to create reservation. Error: " + error.message);
    }
  };

  return (
    <div className="submit-form">
      <h1>Create Reservation</h1>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <select
          className="form-control"
          id="location"
          required
          name="Location"
          onChange={handleChange}
          value={inputs.Location}
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location.Postal}>
              {location.Name} ({location.City}, {location.Street + " Street"},{" "}
              {location.Postal})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dateSelect">Select Date</label>
        <input
          type="date"
          className="form-control"
          id="dateSelect"
          required
          name="date"
          value={inputs.date}
          onChange={handleChange}
        />
      </div>

      <label>Select a Time</label>
      <input
        type="time"
        className="form-control"
        id="timeSelect"
        required
        name="time"
        value={inputs.time}
        onChange={handleChange}
        min="09:00"
        max="22:00"
      />

      <div className="form-group">
        <label htmlFor="Customer">Phone number</label>
        <input
          type="text"
          className="form-control"
          id="Customer"
          required
          maxLength="10"
          name="Customer"
          value={inputs.Customer}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="numPeople">Number of People</label>
        <input
          type="number"
          className="form-control"
          id="numPeople"
          required
          name="numPeople"
          value={inputs.numPeople}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} className="btn btn-success">
        Create Reservation
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddReservation;

import React, { useState, useEffect } from "react";
import ReservationDataService from "../services/reservation.service";
import LocationDataService from "../services/location.service";

const AddReservation = () => {
  const [inputs, setInputs] = useState({
    Customer: "",
    location: "",
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
    if (!input.location) {
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
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Combine the date and time for DateTime
    const dateTime = `${inputs.date} ${inputs.time}:00`;

    // Extract the selected location's postal code
    const selectedLocation = locations.find(
      (location) => location.Postal === inputs.location
    );

    if (!selectedLocation) {
      setError("Please select a valid location.");
      return;
    }

    const fullReservationData = {
      Customer: inputs.Customer,
      Location: selectedLocation.Postal, // Use the postal code of the selected location
      NumPeople: inputs.numPeople,
      Type: inputs.type,
      DateTime: dateTime,
    };

    try {
      await ReservationDataService.createReservation(fullReservationData);
      setError("Reservation created successfully!");
      setInputs({
        Customer: "",
        location: "",
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
          name="location"
          onChange={handleChange}
          value={inputs.location}
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
      <select
        className="form-control"
        id="timeSelect"
        required
        name="time"
        onChange={handleChange}
      >
        <option key="" value="">
          Select Time
        </option>
        {availableTimes.map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </select>

      <div className="form-group">
        <label htmlFor="Customer">Phone number</label>
        <input
          type="text"
          className="form-control"
          id="Customer"
          required
          maxLength="14"
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

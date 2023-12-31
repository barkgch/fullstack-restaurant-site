import React, { useState, useEffect } from "react";
import ReservationDataService from "../services/reservation.service";
import LocationDataService from "../services/location.service";
import CustomerDataService from "../services/customer.service";

const AddReservation = () => {
  const [inputs, setInputs] = useState({
    Customer: "",
    Location: "", // Changed to "Location"
    numPeople: "",
    type: "Regular",
    date: "",
    time: "",
  });
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    LocationDataService.getDistinguish()
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  useEffect(() => {
    CustomerDataService.getAll()
      .then((response) => {
        setCustomers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Customers:", error);
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

    const customerExists = customers.some(
      (customer) => customer.PhoneNum === input.Customer
    );

    if (!customerExists) {
      throw new Error("Please use a registered customer");
      return;
    }

    const dateTimeString = `${input.date} ${input.time}:00`;
    const reservationDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();

    if (reservationDateTime <= currentDateTime) {
      throw new Error("Reservation date and time must be in the future.");
    }
    if (!input.time) {
      throw new Error("Please select a time!");
    }
    const convertTo24HourFormat = (time12h) => {
      let [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");

      // Convert "12 AM" to "00" and keep "12 PM" as "12"
      if (hours === "12") {
        hours = modifier === "AM" ? "00" : "12";
      } else if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }

      return `${hours}:${minutes}`;
    };

    if (input.time) {
      const time24h = convertTo24HourFormat(input.time);
      console.log(time24h);
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      validateInput(inputs);

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
    } catch (validationError) {
      setError(validationError.message);
      return;
    }
  };

  return (
    <div className="add-reservation-form">
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
      {error && (
        <div
          className="alert alert-danger"
          role="alert"
          style={{ marginTop: "10px" }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AddReservation;

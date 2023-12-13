import React, { useState, useEffect } from "react";
import SpecialReservationDataService from "../services/special_reservation.service";
import LocationDataService from "../services/location.service";

const CreateSpecialReservation = () => {
  const [reservationData, setReservationData] = useState({
    Customer: "",
    Location: "",
    Description: "",
    RequestedDate: "",
    RequestedTime: "",
  });
  const [message, setMessage] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    LocationDataService.getDistinguish()
      .then((response) => {
        setLocations(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReservationData({ ...reservationData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // Set TimePlaced to the current time
    const timePlaced = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Combine the date and time for TimeRequested
    const timeRequested = `${reservationData.RequestedDate} ${reservationData.RequestedTime}:00`;

    // Extract the selected location's postal code
    const selectedLocation = locations.find(
      (location) => location.Postal === reservationData.location
    );

    if (!selectedLocation) {
      setMessage("Please select a valid location.");
      return;
    }

    // Remove spaces from the postal code
    const postalCodeWithoutSpaces = selectedLocation.Postal.replace(/\s/g, "");

    const fullReservationData = {
      Customer: reservationData.Customer,
      Location: postalCodeWithoutSpaces, // Set Location to the cleaned postal code
      Description: reservationData.Description,
      TimePlaced: timePlaced,
      TimeRequested: timeRequested,
    };

    try {
      await SpecialReservationDataService.createSpecialReservation(
        fullReservationData
      );
      setMessage("Reservation created successfully!");
    } catch (error) {
      setMessage("Failed to create reservation. Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Create Special Reservation Inquiry</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Phone Number:
          <input
            type="text"
            name="Customer"
            value={reservationData.Customer}
            onChange={handleInputChange}
          />
        </label>

        <div>
          <label htmlFor="location">Select Location:</label>
          <select
            id="location"
            name="location"
            value={reservationData.location}
            onChange={handleInputChange}
          >
            <option value="Please select a location">Select Location</option>
            {locations.map((location, index) => (
              <option key={index} value={location.Postal}>
                {location.Name} ({location.City}, {location.Street + " Street"},{" "}
                {location.Postal})
              </option>
            ))}
          </select>
        </div>

        <label>
          Description:
          <input
            type="text"
            name="Description"
            value={reservationData.Description}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Requested Date:
          <input
            type="date"
            name="RequestedDate"
            onChange={handleInputChange}
            value={reservationData.RequestedDate}
          />
        </label>

        <label>
          Requested Time:
          <input
            type="time"
            name="RequestedTime"
            onChange={handleInputChange}
            value={reservationData.RequestedTime}
          />
        </label>
        <button type="submit">Create Reservation</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateSpecialReservation;

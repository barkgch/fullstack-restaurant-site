import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ReservationDataService from "../services/reservation.service"; // Import the service

const ReservationUpdate = () => {
  const { location, DateTime, Customer } = useParams(); // Get the location and DateTime from the URL parameters

  // Format DateTime in SQL DATETIME format
  const formattedDateTime = new Date(DateTime)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // State to store the input fields for updating the reservation
  const [reservationUpdate, setReservationUpdate] = useState({
    numPeople: "",
    DateTime: formattedDateTime,
  });

  // Function to handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationUpdate({ ...reservationUpdate, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const { numPeople, DateTime } = reservationUpdate;

    // Validate numPeople
    if (numPeople && (isNaN(numPeople) || numPeople <= 0 || numPeople >= 20)) {
      alert("Number of people must be a positive integer less than 20.");
      return;
    }

    // Validate DateTime format
    if (DateTime && isNaN(new Date(DateTime).getTime())) {
      alert("Invalid date and time format.");
      return;
    }

    // Call the updateReservation service method
    ReservationDataService.updateReservation()
      .then((response) => {
        console.log("Reservation updated successfully:", response.data);
        // Handle successful update
      })
      .catch((error) => {
        console.error("Error updating reservation:", error);
        // Handle error case
      });
  };

  const handleDelete = () => {
    ReservationDataService.deleteReservation();
    console.log("Delete reservation functionality goes here");
  };

  return (
    <div>
      <h2>Update Reservation</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numPeople">Number of People:</label>
          <input
            type="number"
            className="form-control"
            id="numPeople"
            name="numPeople"
            value={reservationUpdate.numPeople}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateTime">Date and Time:</label>
          <input
            type="datetime-local"
            className="form-control"
            id="dateTime"
            name="dateTime"
            value={reservationUpdate.DateTime}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Reservation
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default ReservationUpdate;

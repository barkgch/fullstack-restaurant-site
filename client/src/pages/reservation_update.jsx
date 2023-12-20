import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReservationDataService from "../services/reservation.service";
import LocationDataService from "../services/location.service";
import CustomerDataService from "../services/customer.service";

const ReservationUpdate = () => {
  // Extracting parameters from URL
  const { location, DateTime, Customer } = useParams();
  const navigate = useNavigate();

  // State for handling locations and reservations
  const [locations, setLocations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [previousReservation, setPreviousReservation] = useState({
    Customer: Customer,
    numPeople: "",
    Location: location,
    Type: "",
    DateTime: DateTime,
  });
  const [reservationUpdate, setReservationUpdate] = useState({
    Customer: Customer,
    numPeople: "",
    Location: location,
    Type: "",
    DateTime: DateTime,
  });

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

  // Fetching locations on component mount
  useEffect(() => {
    LocationDataService.getDistinguish()
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  // Function to format date-time string for input fields
  const formatDateTimeForInput = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    if (isNaN(dateTime.getTime())) {
      return ""; // Return an empty string if dateTimeStr is invalid
    }

    const offset = dateTime.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localISOTime = new Date(dateTime - offset).toISOString().slice(0, 16);
    return localISOTime; // Format to yyyy-MM-ddTHH:mm
  };

  // Fetching reservation data based on parameters
  useEffect(() => {
    async function fetchReservation() {
      try {
        const response =
          await ReservationDataService.getReservationsByCustomerLocationDate(
            reservationUpdate.Customer,
            reservationUpdate.Location,
            reservationUpdate.DateTime
          );
        const { Customer, numPeople, Location, Type, DateTime } = response.data;
        setPreviousReservation({
          Customer,
          numPeople,
          Location,
          Type,
          DateTime: formatDateTime(DateTime),
        });
        setReservationUpdate({
          Customer,
          numPeople,
          Location,
          Type,
          DateTime: formatDateTime(DateTime),
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchReservation();
  }, [Customer, location, DateTime]);

  // Function to format date-time for display
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Function to handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage("");
    if (name === "DateTime") {
      if (!value) {
        // If DateTime is empty or invalid, set an error message and return
        setErrorMessage("Please enter a valid date and time.");
        return;
      }
      const formattedDateTime = formatDateTime(value);
      const timeFormatted = convertTo24HourFormat(formattedDateTime);
      setReservationUpdate({ ...reservationUpdate, [name]: timeFormatted });
    } else {
      setReservationUpdate({ ...reservationUpdate, [name]: value });
    }
  };

  // Function to convert to 24-hour format
  const convertTo24HourFormat = (dateString) => {
    const [datePart, timePart] = dateString.split(", ");
    const [month, day, year] = datePart.split("/");
    const [time, modifier] = timePart.split(" ");
    let [hours, minutes, seconds] = time.split(":");

    if (hours === "12") {
      hours = modifier === "AM" ? "00" : "12";
    } else if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Function to generate a reservation identifier
  const generateReservationIdentifier = (location, datetime, customer) => {
    const date = new Date(datetime);
    const formattedDateTime = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    return `${location}/${formattedDateTime}/${customer}`;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { numPeople, DateTime, Customer } = reservationUpdate;

    if (
      numPeople === "" ||
      isNaN(numPeople) ||
      numPeople <= 0 ||
      numPeople >= 20
    ) {
      setErrorMessage(
        "Number of people must be a positive integer less than 20."
      );
      return;
    }

    if (DateTime && isNaN(new Date(DateTime).getTime())) {
      setErrorMessage("Invalid date and time format.");
      return;
    }

    const reservationDate = new Date(DateTime);
    const currentDate = new Date();
    if (reservationDate <= currentDate) {
      setErrorMessage("Reservation date and time must be in the future.");
      return;
    }

    const reservationHour = reservationDate.getHours();

    // Check if the reservation time is between 9 AM (9) and 10 PM (22)
    if (reservationHour < 9 || reservationHour >= 22) {
      setErrorMessage("Reservations must be between 9 AM and 10 PM.");
      return;
    }

    const customerExists = customers.some(
      (customer) => customer.PhoneNum === Customer
    );

    if (!customerExists) {
      setErrorMessage("Please use a registered customer");
      return;
    }

    setErrorMessage("");

    const timeUpdated = reservationUpdate.DateTime;
    const formattedDateTimeUpdate = formatDateTime(timeUpdated);
    const timeFormattedUpdate = convertTo24HourFormat(formattedDateTimeUpdate);

    reservationUpdate.DateTime = timeFormattedUpdate;
    console.log("Sent updated: ", reservationUpdate);

    const timePrev = previousReservation.DateTime;
    const formattedDateTimePrev = formatDateTime(timePrev);
    const timeFormattedPrev = convertTo24HourFormat(formattedDateTimePrev);

    previousReservation.DateTime = timeFormattedPrev;
    console.log("Sent previous: ", previousReservation);
    try {
      ReservationDataService.updateReservation(
        reservationUpdate,
        previousReservation
      )
        .then((response) => {
          console.log("Reservation updated successfully:", response.data);
          navigate(
            `/reservation/update/${generateReservationIdentifier(
              reservationUpdate.Location,
              reservationUpdate.DateTime,
              reservationUpdate.Customer
            )}`
          );
          setSuccessMessage("Reservation seuccesfully updated");
        })
        .catch((error) => {
          console.error("Error updating reservation:", error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  // Function to handle reservation deletion
  const handleDelete = () => {
    console.log(Customer, location, DateTime);
    ReservationDataService.deleteReservation(Customer, location, DateTime);
    navigate("/reservation/view");
  };

  // Component render
  return (
    <div className="update-reservation-page">
      {/* Reservation update form */}
      <h2>Update Reservation</h2>
      <form onSubmit={handleSubmit}>
        {/* Customer input */}
        <div className="form-group">
          <label htmlFor="Customer">Phone Number:</label>
          <input
            type="text"
            className="form-control"
            id="Customer"
            name="Customer"
            value={reservationUpdate.Customer}
            onChange={handleInputChange}
            placeholder={reservationUpdate.Customer || "Phone Number"}
          />
        </div>

        {/* Number of People input */}
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

        {/* Location selection */}
        <div className="form-group">
          <label htmlFor="Location">Location:</label>
          <select
            className="form-control"
            id="Location"
            name="Location"
            value={reservationUpdate.Location}
            onChange={handleInputChange}
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.Postal} value={location.Postal}>
                {location.Name} ({location.Postal})
              </option>
            ))}
          </select>
        </div>

        {/* Type selection */}
        <div className="form-group">
          <label htmlFor="Type">Type:</label>
          <select
            className="form-control"
            id="Type"
            name="Type"
            value={reservationUpdate.Type}
            onChange={handleInputChange}
          >
            <option value="">Select Type</option>
            <option value="Regular">Regular</option>
            <option value="Special">Special</option>
          </select>
        </div>

        {/* Date and Time input */}
        <div className="form-group">
          <label htmlFor="DateTime">Date and Time:</label>
          <input
            type="datetime-local"
            className="form-control"
            id="DateTime"
            name="DateTime"
            value={formatDateTimeForInput(reservationUpdate.DateTime)}
            onChange={handleInputChange}
          />
        </div>

        {/* Success message display */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Error message display */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Update and Delete buttons */}
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

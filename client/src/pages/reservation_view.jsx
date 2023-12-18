import React, { useState, useEffect } from "react";
import ReservationDataService from "../services/reservation.service";
import LocationDataService from "../services/location.service";
import { Link } from "react-router-dom"; // Import Link from React Router

const ViewReservations = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [reservations, setReservations] = useState([]);
  const [selectedLocationData, setSelectedLocationData] = useState(null);

  useEffect(() => {
    // Fetch all locations when the component mounts
    LocationDataService.getDistinguish()
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      // Fetch normal reservations for the selected location
      ReservationDataService.getReservationsByLocation(selectedLocation)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setReservations(response.data);
          } else {
            console.error("Received data is not in array format");
            setReservations([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);
          setReservations([]);
        });
    }

    // Find the selected location data
    const locationData = locations.find(
      (location) => location.Postal === selectedLocation
    );
    setSelectedLocationData(locationData);
  }, [selectedLocation, locations]);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Function to format date and time
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

  // Function to generate a unique reservation identifier
  const generateReservationIdentifier = (location, datetime, customer) => {
    return `${location}/${datetime}/${customer}`;
  };

  return (
    <div className="reservation-view-page">
      <h2>View Reservations</h2>
      <label htmlFor="location">Select Location:</label>
      <select
        id="location"
        name="location"
        value={selectedLocation}
        onChange={handleLocationChange}
      >
        <option value="">Select Location</option>
        {locations.map((location) => (
          <option key={location.Postal} value={location.Postal}>
            {location.Name} ({location.Postal})
          </option>
        ))}
      </select>

      {selectedLocationData && (
        <div className="location-details">
          <h3>
            Reservations for: <br /> {selectedLocationData.Name} (
            {selectedLocationData.Postal})
          </h3>
          {reservations.length > 0 ? (
            <ul>
              {reservations.map((reservation) => (
                <li
                  key={generateReservationIdentifier(
                    reservation.Location,
                    reservation.DateTime,
                    reservation.Customer
                  )}
                >
                  <span className="reservation-detail">
                    Customer: {reservation.Customer}
                  </span>
                  <span className="reservation-detail">
                    Number of People: {reservation.numPeople}
                  </span>
                  <span className="reservation-detail">
                    Type: {reservation.Type}
                  </span>
                  <span className="reservation-detail">
                    Date and Time: {formatDateTime(reservation.DateTime)}
                  </span>
                  <Link
                    className="reservation-update-link"
                    to={`/reservation/update/${generateReservationIdentifier(
                      reservation.Location,
                      reservation.DateTime,
                      reservation.Customer
                    )}`}
                  >
                    Update
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No normal reservations found for this location.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewReservations;

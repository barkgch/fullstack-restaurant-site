import React, { useState, useEffect } from "react";
import LocationDataService from "../services/location.service";
import SpecialReservationDataService from "../services/special_reservation.service";

const ViewSpecialReservations = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [reservations, setReservations] = useState([]);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [dateAfter, setDateAfter] = useState(""); // State for "Date after"
  const [dateBefore, setDateBefore] = useState(""); // State for "Date before"

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
      // Fetch special reservations for the selected location
      SpecialReservationDataService.findByLocation(selectedLocation)
        .then((response) => {
          if (Array.isArray(response.data)) {
            // Filter reservations based on the date range (dateAfter and dateBefore)
            const filteredReservations = response.data.filter((reservation) => {
              const TimeRequested = new Date(reservation.TimeRequested);
              return (
                (!dateAfter || TimeRequested >= new Date(dateAfter)) &&
                (!dateBefore || TimeRequested <= new Date(dateBefore))
              );
            });

            // Sort the filtered reservations in descending order based on TimePlaced
            const sortedReservations = filteredReservations.sort(
              (a, b) => new Date(b.TimePlaced) - new Date(a.TimePlaced)
            );

            setReservations(sortedReservations);
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
  }, [selectedLocation, locations, dateAfter, dateBefore]);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleDateAfterChange = (event) => {
    setDateAfter(event.target.value);
  };

  const handleDateBeforeChange = (event) => {
    setDateBefore(event.target.value);
  };

  // Function to format date and time
  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return dateTime.toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <h2>View Special Reservation Inquiries</h2>
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

      {/* Date input fields */}
      <div>
        <label htmlFor="dateAfter">Date After:</label>
        <input
          type="date"
          id="dateAfter"
          name="dateAfter"
          value={dateAfter}
          onChange={handleDateAfterChange}
        />
      </div>
      <div>
        <label htmlFor="dateBefore">Date Before:</label>
        <input
          type="date"
          id="dateBefore"
          name="dateBefore"
          value={dateBefore}
          onChange={handleDateBeforeChange}
        />
      </div>

      {selectedLocationData && (
        <div>
          <h3>
            Special Reservations for <br /> {selectedLocationData.Name} (
            {selectedLocationData.Postal})
          </h3>
          {reservations.length > 0 ? (
            <ul>
              {reservations.map((reservation) => (
                <li key={reservation.Id}>
                  Customer: {reservation.Customer}, Description:{" "}
                  {reservation.Description}, Time Placed:{" "}
                  {formatDateTime(reservation.TimePlaced)}, Requested Time:{" "}
                  {formatDateTime(reservation.TimeRequested)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No special reservations found for this location.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewSpecialReservations;

/**
 * Page for displaying all locations and their data.
 * This component fetches and displays location details like name, email, phone,
 * street, city, province, and postal code.
 *
 * BASED ON:
 *  - BezKoder's React.js CRUD example to consume Web API
 *        https://www.bezkoder.com/react-crud-web-api/
 *  - Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *        https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 *        https://github.com/safak/youtube2022/tree/blog-app
 */
import React, { useState, useEffect } from "react";
import LocationDataService from "../services/location.service.js";

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    retrieveLocations();
  }, []);

  const retrieveLocations = async () => {
    setIsLoading(true);
    try {
      const response = await LocationDataService.getAllLocation();
      setLocations(response.data);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="list row">
      <h1>Locations</h1>
      <div className="col-md-6">
        <ul className="list-group">
          {locations.map((location) => (
            <li className="list-group-item" key={location.Postal}>
              {" "}
              <strong>Name:</strong> {location.Name} <br />
              <strong>Email:</strong> {location.Email} <br />
              <strong>Phone:</strong> {location.PhoneNum} <br />
              <strong>Street:</strong> {location.Street} <br />
              <strong>City:</strong> {location.City} <br />
              <strong>Province:</strong> {location.Province} <br />
              <strong>Postal:</strong> {location.Postal} <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LocationList;

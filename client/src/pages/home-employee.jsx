/**
 * Page to allow logging into accounts.
 *
 * BASED ON:
 *  - BezKoder's React.js CRUD example to consume Web API
 *        https://www.bezkoder.com/react-crud-web-api/
 *  - Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *        https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 *        https://github.com/safak/youtube2022/tree/blog-app
 */
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth.context.js";
import ReservationUpdate from "./reservation_update.jsx";

const EmployeeHomepage = () => {
  const { currentUser } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    Email: "",
    Password: "",
  });
  const [err, setError] = useState(null);
  const { loginCustomer, loginEmployee } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const validateInput = (input) => {
    // confirm email
    if (input.Email === undefined || input.Email === "") {
      throw new Error("Please enter an email address!");
    } else {
      // TODO: perform additional tests to confirm validity of address
    }
    // confirm password
    if (input.Password === undefined || input.Password === "") {
      throw new Error("Please enter a password!");
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRedirect = (e) => {
    if (e.target.name == "home") navigate("/");
    if (e.target.name == "employee-login") navigate("/employee/login");
    if (e.target.name == "employee-create") navigate("/employee/createAccount");
    if (e.target.name == "employee-customer-list")
      navigate("/employee/customerList");
    if (e.target.name == "special-Reservation-View")
      navigate("/specialreservation/view");
    if (e.target.name == "reservation-view") navigate("/reservation/view");
  };

  return (
    <div>
      {currentUser && currentUser.type == "employee" ? (
        <div className="page btn-col">
          {/* Existing buttons */}
          <div>
            <button
              className="btn-themed"
              name="employee-customer-list"
              onClick={handleRedirect}
            >
              See Customer Account List
            </button>
          </div>
          <div>
            <button
              className="btn-themed"
              name="employee-create"
              onClick={handleRedirect}
            >
              Create New Employee Account
            </button>
          </div>

          {/* New buttons */}
          {currentUser.permission >= 1 ? (
            <div>
              <button
                className="btn-themed"
                name="reservation-view"
                onClick={handleRedirect}
              >
                Reservation View
              </button>
            </div>
          ) : (
            <div></div>
          )}

          {currentUser.permission >= 1 ? (
            <div>
              <button
                className="btn-themed"
                name="special-Reservation-View"
                onClick={handleRedirect}
              >
                Special Reservation View
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div className="page">
          <h1>Hi there!</h1>
          <p>If you're not an employee, you're in the wrong place!</p>
          <div className="btn-row">
            <button className="btn-themed" name="home" onClick={handleRedirect}>
              Go to home
            </button>
            <button
              className="btn-themed"
              name="employee-login"
              onClick={handleRedirect}
            >
              Go to employee login
            </button>
          </div>
        </div>
      )}
    </div>

    // <div className="submit-form">
    //   {location.pathname === '/login' ? <h1>Login</h1> : <h1>Employee Login</h1>}
    //   <div className="form-group">
    //     <label htmlFor="email">Email</label>
    //     <input
    //       type="text"
    //       className="form-control"
    //       id="email"
    //       required
    //       name="Email"
    //       onChange={handleChange}
    //     />
    //   </div>

    //   <div className="form-group">
    //     <label htmlFor="password">Password</label>
    //     <input
    //       type="password"
    //       className="form-control"
    //       id="password"
    //       required
    //       maxLength="12"
    //       name="Password"
    //       onChange={handleChange}
    //     />
    //   </div>

    //   <button onClick={handleSubmit} className="btn btn-success">
    //     Login
    //   </button>
    //   {err && <p>{err}</p>}
    //   <p>Don't have an account? <Link to="/register">Create one</Link>!</p>
    //   {location.pathname === '/login' ?
    //     <p>Are you an employee? Head over to the <Link to="/employee/login">employee login</Link>!</p> :
    //     <p>Are you a customer? Head over to the <Link to="/register">customer login</Link>!</p>
    //   }
    // </div>
  );
};

export default EmployeeHomepage;

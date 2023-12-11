/**
 * Page to allow creation of customer account.
 * 
 * BASED ON:
 *  - BezKoder's React.js CRUD example to consume Web API
 *        https://www.bezkoder.com/react-crud-web-api/
 *  - Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *        https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 *        https://github.com/safak/youtube2022/tree/blog-app
 */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AccountDataService from "../services/account.service.js";

const Register = () => {
  const [inputs, setInputs] = useState({
    FName: "",
    LName: "", 
    PhoneNum: "",
    Email: "",
    Password: ""
  })
  const [err, setError] = useState(null);

  const navigate = useNavigate();


  const validateInput = (input) => {
    // confirm firstname
    if (input.FName === undefined || input.FName === "") {
      // setError("Please enter a firstname!");
      throw(new Error("Please enter a firstname!"));
    }
    //confirm lastname
    if (input.LName === undefined || input.LName === "") {
      throw(new Error("Please enter a lastname!"));
    }
    // confirm phone number
    if (input.PhoneNum === undefined || input.PhoneNum === "") {
      throw(new Error("Please enter a phone number!"));
    } else {
      // TOOD: perform additional tests to confirm validity of number
    }
    // confirm email
    if (input.Email === undefined || input.Email === "") {
      throw(new Error("Please enter an email address!"));
    } else {
      // TODO: perform additional tests to confirm validity of address
    }
    // confirm password
    if (input.Password === undefined || input.Password === "") {
      throw(new Error("Please enter a password!"));
    }
  }


  const handleChange = e => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }


  const handleSubmit = async e => {
    e.preventDefault()  // prevents page refresh on submission

    var data = {
      PhoneNum: inputs.PhoneNum,
      Email: inputs.Email,
      FName: inputs.FName,
      LName: inputs.LName,
      Password: inputs.Password
    };
    try { validateInput(data); }
    catch (e) {
      setError(e.message);
      return;
    }

    try {
      await AccountDataService.registerCustomer(data);
    } catch (e) {
      setError(e.response.data.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="submit-form">
      <h1>Register</h1>
      <div className="form-group">
        <label htmlFor="fname">First name</label>
        <input
          type="text"
          className="form-control"
          id="fName"
          required
          maxLength="35"
          name="FName"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="lName">Last name</label>
        <input
          type="text"
          className="form-control"
          id="lName"
          required
          maxLength="35"
          name="LName"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNum">Phone number</label>
        <input
          type="text"
          className="form-control"
          id="phoneNum"
          required
          maxLength="14"
          name="PhoneNum"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          className="form-control"
          id="email"
          required
          name="Email"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          required
          maxLength="12"
          name="Password"
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} className="btn btn-success">
        Create Account
      </button>
      {err && <p>{err}</p>}
      <p>Already have an account? Go to <Link to="/login">login</Link></p>
    </div>
  )
}

export default Register
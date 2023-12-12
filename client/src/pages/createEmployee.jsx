/**
 * Page for employees to make accounts for other employees.
 * (If an employee wishes to assist a customer by making an account for them,
 * they can do so through the normal register page.)
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

const CreateEmployeeAccount = () => {
  const [inputs, setInputs] = useState({
    FName: "",
    LName: "", 
    PermissionLevel: 0,
    Email: "",
    Password: ""
  })
  const [err, setError] = useState(null);

  const navigate = useNavigate();


  const validateInput = (input) => {
    // confirm firstname
    if (input.FName === undefined || input.FName === "") {
      // setError("Please enter a firstname!");
      throw(new Error("Please enter employee's firstname!"));
    }
    //confirm lastname
    if (input.LName === undefined || input.LName === "") {
      throw(new Error("Please enter emplyoee's lastname!"));
    }
    // confirm permission level
    if (input.PermissionLevel === undefined || input.PermissionLevel === "") {
      throw(new Error("Please enter a permission level for this employee!"));
    } else {
      // TOOD: perform additional tests to confirm validity of number
    }
    // confirm email
    if (input.Email === undefined || input.Email === "") {
      throw(new Error("Please enter employee's email address!"));
    } else {
      // TODO: perform additional tests to confirm validity of address
    }
    // confirm password
    if (input.Password === undefined || input.Password === "") {
      throw(new Error("Please enter a password for the employee!"));
    }
  }


  const handleChange = e => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }


  const handleSubmit = async e => {
    e.preventDefault()  // prevents page refresh on submission

    var data = {
      PermissionLevel: inputs.PermissionLevel,
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
      await AccountDataService.registerEmployee(data);
    } catch (e) {
      setError(e.response.data.message);
      return;
    }

    navigate("/employee");
  };

  return (
    <div className="submit-form">
      <h1>Employee Account Creation</h1>
      <div className="form-group">
        <label htmlFor="fname">Employee First name</label>
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
        <label htmlFor="lName">Employee Last name</label>
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
        <label htmlFor="permission">Employee Permission Level</label>
        <input
          type="text"
          className="form-control"
          id="permission"
          required
          maxLength="2"
          name="PermissionLevel"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Employee Email</label>
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
        <label htmlFor="password">Employee Account Password</label>
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
        Create Employee Account
      </button>
      {err && <p>{err}</p>}
    </div>
  )
}

export default CreateEmployeeAccount
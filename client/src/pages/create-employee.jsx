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
      setInputs({PermissionLevel: 0});
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
    <form className="page">
      <h1>Employee Account Creation</h1>
      <div className="label-group">
        <label>Name</label>
        <div className='input-row'>
          <input
            type="text"
            className="label-content"
            id="fName"
            maxLength="35"
            name="FName"
            placeholder='firstname'
            onChange={handleChange}
          />
          <input
            type="text"
            className="label-content"
            id="lName"
            maxLength="35"
            name="LName"
            placeholder='lastname'
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="label-group">
        <label>Clearance</label>
        <input
          type="number"
          className="label-content"
          id="permission"
          maxLength="2"
          name="PermissionLevel"
          placeholder='0'
          onChange={handleChange}
        />
      </div>

      <div className="label-group">
        <label>Email</label>
        <input
          type="email"
          className="label-content"
          id="email"
          name="Email"
          placeholder='example@email.com'
          onChange={handleChange}
        />
      </div>

      <div className="label-group">
        <label>Password</label>
        <input
          type="password"
          className="label-content"
          id="password"
          maxLength="12"
          name="Password"
          placeholder='password'
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} className="btn-submit">
        Create Employee Account
      </button>
      {err && <p className='err-msg'>{err}</p>}
    </form>
  )
}

export default CreateEmployeeAccount
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
    <form className="page">
      <h1>Register</h1>
      <div className="label-group">
        <label htmlFor="fname">Name</label>
        <div className='input-row'>
          <input
            type="text"
            className="label-content"
            id="fName"
            required
            maxLength="35"
            name="FName"
            placeholder='firstname'
            onChange={handleChange}
          />
          <input
            type="text"
            className="label-content"
            id="lName"
            required
            maxLength="35"
            name="LName"
            placeholder='lastname'
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="label-group">
        <label htmlFor="phoneNum">Phone number</label>
        <input
          type="text"
          className="label-content"
          id="phoneNum"
          required
          maxLength="14"
          name="PhoneNum"
          placeholder='+1(555)555-5555'
          onChange={handleChange}
        />
      </div>

      <div className="label-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="label-content"
          id="email"
          required
          name="Email"
          placeholder='example@email.com'
          onChange={handleChange}
        />
      </div>

      <div className="label-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="label-content"
          id="password"
          required
          maxLength="12"
          name="Password"
          placeholder='password'
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} className="btn-submit">
        Create Account
      </button>
      {err && <p className='err-msg'>{err}</p>}
      <p>Already have an account? Go to <Link to="/login">login</Link></p>
    </form>
  )
}

export default Register
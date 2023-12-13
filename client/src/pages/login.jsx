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
import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthContext } from '../context/auth.context.js';

const Login = () => {
  const [inputs, setInputs] = useState({
    Email: "",
    Password: ""
  })
  const [err, setError] = useState(null);
  const { loginCustomer, loginEmployee } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();


  const validateInput = (input) => {
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
      Email: inputs.Email,
      Password: inputs.Password
    };
    try { validateInput(data); }
    catch (e) {
      setError(e.message);
      return;
    }

    try {
      if (location.pathname === '/employee/login') {
        // employee login
        await loginEmployee(inputs);
      } else {
        // customer login
        await loginCustomer(inputs);
      }
    } catch (e) {
      setError(e.response.data.message);
      return;
    }

    navigate("/");
  };

  
  return (
    <div className="submit-form">
      {location.pathname === '/employee/login' ? <h1>Employee Login</h1> : <h1>Login</h1>}
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
        Login
      </button>
      {err && <p>{err}</p>}
      <p>Don't have an account? <Link to="/register">Create one</Link>!</p>
      {location.pathname === '/employee/login' ? 
        <p>Are you a customer? Head over to the <Link to="/register">customer login</Link>!</p> :
        <p>Are you an employee? Head over to the <Link to="/employee/login">employee login</Link>!</p>
      }
    </div>
  )
}

export default Login
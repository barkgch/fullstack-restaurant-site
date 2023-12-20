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
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthContext } from "../context/auth.context.js";
import ReservationUpdate from "./reservation_update.jsx";

const EmployeeHomepage = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <div>
      {currentUser && currentUser.type === 'employee' ? (
        <div className='page btn-col'>
          
          <button className='btn-themed' 
          onClick={() => {navigate('/reservation/view')}}>
            See Booked Reservations
          </button>
          
          {currentUser.permission >= 1 ? (
            <button className='btn-themed' 
            onClick={() => {navigate('/specialreservation/view')}}>
              See Special Reservation Inquiries
            </button>
          ) : (
            <div></div>
          )}

          {currentUser.permission >= 2 ? (
            <button className='btn-themed'
            onClick={() => {navigate('/employee/customerList')}}>
              See Customer Account List
            </button>
          ) : (
            <div></div>
          )}

          {currentUser.permission >= 5 ? (
          <button className='btn-themed'
          onClick={() => {navigate('/employee/createAccount')}}>
            Create New Employee Account
          </button>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div className="page">
          <h1>Hi there!</h1>
            <p>If you're not an employee, you're in the wrong place!</p>
            <div className='btn-row'>
              <button className='btn-themed'
              onClick={() => {navigate('/')}}>
                Go to home
              </button>
              <button className='btn-themed'
              onClick={() => {navigate('/employee/login')}}>
                Go to employee login
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHomepage;

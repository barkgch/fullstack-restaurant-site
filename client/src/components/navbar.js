import React, { useState, useContext } from 'react'
import {Link} from 'react-router-dom'

import Logo from '../img/logo.png'
import { AuthContext } from '../context/auth.context.js'

const Navbar = () => {

  const {currentUser, logout} = useContext(AuthContext);

  return (
    <nav>
      <Link to={"/"} className="nav-brand">
        <img src={Logo} className='logo' />
      </Link>
      <div className="nav-items">
        <div className="nav-item">
          <Link to={"/customers"} className="nav-link">
            Customers
          </Link>
        </div>
        <div className="nav-item">
          <Link to={"/add"} className="nav-link">
            Add
          </Link>
        </div>
      </div>
      {currentUser ? 
        <div className='nav-account'>
          <Link to={`/account/${currentUser.id}`} className='nav-link'>My Account</Link>
          /
          <span onClick={logout} className='nav-link nav-logout'>Logout</span>
        </div> : 
        <div className='nav-account'>
          <Link to={'/login'} className='nav-link'>Login</Link> 
          /
          <Link to={'/register'} className='nav-link'>Register</Link>
        </div>
      }
    </nav>
  )
}

export default Navbar
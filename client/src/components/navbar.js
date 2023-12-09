import React, { useState, useContext } from 'react'
import {Link} from 'react-router-dom'

import Logo from '../img/logo.png'
// import { AuthContext } from '../context/authContext'

const Navbar = () => {

  // const {currentUser, logout} = useContext(AuthContext);

  return (
    // <div className='navbar'>
    //   <div className='container'>
    //     <div className='logo'>
    //       <Link to='/'>
    //         <img src={Logo} />
    //       </Link>
    //     </div>
    //     <div className='links'>
    //       <Link className='link' to='/?cat=art1'><h6>ART1</h6></Link>
    //       <Link className='link' to='/?cat=art2'><h6>ART2</h6></Link>
    //       <Link className='link' to='/?cat=art3'><h6>ART3</h6></Link>
    //       <Link className='link' to='/?cat=art4'><h6>ART4</h6></Link>
    //       {/* <span>{currentUser?.username}</span>
    //       {currentUser ? <span onClick={logout}>Logout</span> : <Link className='link' to='/login'>Login</Link>}
    //       <span className='write'>
    //         <Link className="link" to='write'>Write</Link>
    //       </span> */}
    //     </div>
    //   </div>
    // </div>
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to={"/"} className="navbar-brand">
        <img src={Logo} className='logo' />
      </Link>
      <div className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to={"/customers"} className="nav-link">
            Customers
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/add"} className="nav-link">
            Add
          </Link>
        </li>
      </div>
    </nav>
  )
}

export default Navbar
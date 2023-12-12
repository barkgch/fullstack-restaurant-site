import React, {Component} from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import logo from './img/logo.png';
import './style.scss';

import Navbar from './components/navbar.js';
import Footer from './components/footer.js';

import AddCustomer from "./components/add-customer.component";
import Customer from "./components/customer.component";
import CustomersList from "./components/customers-list.component";

import ItemsList from "./components/items-list.components.js";

import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import CreateEmployeeAccount from "./pages/createEmployee.jsx";


class App extends Component {
  render() {
    return (
      <div className="app">
        <Navbar />

        <div className="container">
          <Routes>
            <Route path="/" element={<CustomersList/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employee/login" element={<Login />} />
            <Route path="/employee/createAccount" element={<CreateEmployeeAccount />} />
            <Route path="/customers" element={<CustomersList/>} />
            <Route path="/add" element={<AddCustomer/>} />
            <Route path="/customers/:PhoneNum" element={<Customer/>} />
            <Route path="/menu" element={<ItemsList/>} />
          </Routes>
        </div>

        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;

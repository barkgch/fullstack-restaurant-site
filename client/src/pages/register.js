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
import React, { Component } from "react";
import AccountDataService from "../services/account.service.js";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      FName: "",
      LName: "", 
      Phone: "",
      Email: "",
      Password: "",

      err: false,
      errMessage: ""
    };
  }


  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  };


  async handleSubmit(e) {
    e.preventDefault()  // prevent page from refreshing

    var data = {
      PhoneNum: this.state.Phone,
      Email: this.state.Email,
      FName: this.state.FName,
      LName: this.state.LName,
      Password: this.state.Password
    };

    try {
      await AccountDataService.registerCustomer(data);
    } catch (e) {
      console.log(e);
    }
    // await AccountDataService.registerCustomer(data).then(response => {
    //   console.log(response.data);
    // }).catch(err => {
    //   console.log(err);
    // });

    
  }


  render() {
    return (
      <div className="submit-form">
        <div className="form-group">
          <label htmlFor="fname">First name</label>
          <input
            type="text"
            className="form-control"
            id="fName"
            required
            name="FName"
            onChange={this.handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lName">Last name</label>
          <input
            type="text"
            className="form-control"
            id="lName"
            required
            name="LName"
            onChange={this.handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNum">Phone number</label>
          <input
            type="text"
            className="form-control"
            id="phoneNum"
            required
            name="Phone"
            onChange={this.handleChange}
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
            onChange={this.handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            className="form-control"
            id="password"
            required
            name="Password"
            onChange={this.handleChange}
          />
        </div>

        <button onClick={this.handleSubmit} className="btn btn-success">
          Create Account
        </button>
        {/* {this.state.err && <p>{this.state.errMessage}</p>} */}
      </div>
    );
  }
}

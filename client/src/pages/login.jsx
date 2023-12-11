import React, { Component } from "react";
import CustomerDataService from "../services/customer.service";

export default class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.saveCustomer = this.saveCustomer.bind(this);
    this.newCustomer = this.newCustomer.bind(this);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      PhoneNum: "",
      FName: "",
      LName: "", 

      submitted: false
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  saveCustomer() {
    var data = {
      PhoneNum: this.state.PhoneNum,
      FName: this.state.FName,
      LName: this.state.LName
    };

    CustomerDataService.create(data)
      .then(response => {
        this.setState({
          PhoneNumber: response.data.PhoneNum,
          FName: response.data.FName,
          LName: response.data.LName,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newCustomer() {
    this.setState({
      PhoneNum: null,
      FName: "",
      LName: "",

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newCustomer}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="phoneNum">LOGIN PLACEHOLDER</label>
              <input
                type="text"
                className="form-control"
                id="phoneNum"
                required
                value={this.state.PhoneNum}
                onChange={this.handleChange}
                name="PhoneNum"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fname">First name</label>
              <input
                type="text"
                className="form-control"
                id="fName"
                required
                value={this.state.FName}
                onChange={this.handleChange}
                name="FName"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lName">Last name</label>
              <input
                type="text"
                className="form-control"
                id="lName"
                required
                value={this.state.LName}
                onChange={this.handleChange}
                name="LName"
              />
            </div>

            <button onClick={this.saveCustomer} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}

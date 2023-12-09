import React, { Component } from "react";
import CustomerDataService from "../services/customer.service";

export default class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeFName = this.onChangeFName.bind(this);
    this.onChangeLName = this.onChangeLName.bind(this);
    this.saveCustomer = this.saveCustomer.bind(this);
    this.newCustomer = this.newCustomer.bind(this);

    this.state = {
      PhoneNum: null,
      FName: "",
      LName: "", 

      submitted: false
    };
  }

  onChangePhone(e) {
    this.setState({
      PhoneNum: e.target.value
    });
  }

  onChangeFName(e) {
    this.setState({
      FName: e.target.value
    });
  }

  onChangeLName(e) {
    this.setState({
      LName: e.target.value
    });
  }

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
              <label htmlFor="phoneNum">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNum"
                required
                value={this.state.PhoneNum}
                onChange={this.onChangePhone}
                name="phoneNum"
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
                onChange={this.onChangeFName}
                name="fName"
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
                onChange={this.onChangeLName}
                name="lName"
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

import React, { Component } from "react";
import CustomerDataService from "../services/customer.service";
import { withRouter } from '../common/with-router';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeFName = this.onChangeFName.bind(this);
    this.onChangeLName = this.onChangeLName.bind(this);
    this.getCustomer = this.getCustomer.bind(this);
    this.updateCustomer = this.updateCustomer.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);

    this.state = {
      currentCustomer: {
        PhoneNum: null,
        FName: "",
        LName: ""
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getCustomer(this.props.router.params.PhoneNum);
  }

  onChangePhone(e) {
    const newPhoneNum = e.target.value;

    this.setState(function(prevState) {
      return {
        currentCustomer: {
          ...prevState.currentCustomer,
          PhoneNum: newPhoneNum
        }
      };
    });
  }

  onChangeFName(e) {
    const newFName = e.target.value;
    
    this.setState(prevState => ({
      currentCustomer: {
        ...prevState.currentCustomer,
        FName: newFName
      }
    }));
  }

  onChangeLName(e) {
    const newLName = e.target.value;
    
    this.setState(prevState => ({
      currentCustomer: {
        ...prevState.currentCustomer,
        LName: newLName
      }
    }));
  }

  getCustomer(phoneNum) {
    CustomerDataService.get(phoneNum)
      .then(response => {
        this.setState({
          currentCustomer: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateCustomer() {
    CustomerDataService.update(
      this.state.currentCustomer.PhoneNum,
      this.state.currentCustomer
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The customer was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteCustomer() {    
    CustomerDataService.delete(this.state.currentCustomer.PhoneNum)
      .then(response => {
        console.log(response.data);
        this.props.router.navigate('/tutorials');
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentCustomer } = this.state;

    return (
      <div>
        {currentCustomer ? (
          <div className="edit-form">
            <h4>Customer</h4>
            <form>
              <div className="form-group">
                <label htmlFor="fName">First name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fName"
                  value={currentCustomer.FName}
                  onChange={this.onChangeFName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lName">Last name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lName"
                  value={currentCustomer.LName}
                  onChange={this.onChangeLName}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Phone number</strong>
                </label>
                {currentCustomer.PhoneNum}
              </div>
            </form>

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteCustomer}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateCustomer}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a customer...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Customer);

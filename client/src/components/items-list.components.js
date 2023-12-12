import React, { Component } from "react";
import ItemDataService from "../services/item.service";
import { Link } from "react-router-dom";

export default class ItemsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveItems = this.retrieveItems.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCustomer = this.setActiveItem.bind(this);
    this.removeAllCustomers = this.removeAllItems.bind(this);

    this.state = {
      items: [],
      currentItem: null,
      currentIndex: -1,
      searchFName: ""
    };
  }

  componentDidMount() {
    this.retrieveItems();
  }

  retrieveItems() {
    ItemDataService.getAll()
      .then(response => {
        this.setState({
          items: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveItems();
    this.setState({
      currentItem: null,
      currentIndex: -1
    });
  }

  setActiveItem(item, index) {
    this.setState({
      currentItem: item,
      currentIndex: index
    });
  }

  removeAllItems() {
    ItemDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { items, currentItem, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
          <h4>Items List</h4>

          <ul className="list-group">
            {items &&
              items.map((item, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveItem(item, index)}
                  key={index}
                >
                  {item.Name}
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllItems}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentItem ? (
            <div>
              <h4>Item</h4>
              <div>
                <label>
                  <strong>Name:</strong>
                </label>{" "}
                {currentItem.Name}
              </div>
              <div>
                <label>
                  <strong>Price:</strong>
                </label>{" "}
                {currentItem.Price}
              </div>
              <div>
                <label>
                  <strong>ID:</strong>
                </label>{" "}
                {currentItem.ItemID}
              </div>

              <Link
                to={"/items/" + currentItem.ItemID}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on an item...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

/**
 * Provide way for all pages to make consistent API requests to the correct place.
 */
import axios from "axios";

export default axios.create({
  // baseURL should point to where backend server is running
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8800/api",
  headers: {
    "Content-type": "application/json"
  }
});

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8800/api", // this should point to where backend server is running
  headers: {
    "Content-type": "application/json"
  }
});

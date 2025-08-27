import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
// import App from './App';
import StarRating from "./StarRating";
import App1 from "./App copy";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App1 />
    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating size={23} color="red" defaultRating={3} /> */}
  </React.StrictMode>
);

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

function Test() {
  const [rating, setRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
  }

  return (
    <div>
      <StarRating onSetRating={handleRating} />
      <p>This movie was rated {rating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

    {/* <StarRating />
    <StarRating
      maxRating={5}
      defaultRating={3}
      color="red"
      className="test"
      message={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <Test /> */}
  </React.StrictMode>
);

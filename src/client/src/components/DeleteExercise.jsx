import React, { useState } from "react";
import config from "../config";
import Header from "./Header";

function DeleteExercise() {
  const [exerciseID, setExerciseID] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.resourceServer}/exercises/${exerciseID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          alert(`Successfully Deleted Exercise`)
        } else {
          alert(
            `Failed At Deleting Exercise:
            ${data}`
            )
        }
      });
    });
  }

  return (
    <div>
      <Header />
      <h1>Delete Exercise</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter exerciseID:
          <input 
            type="text" 
            value={exerciseID}
            onChange={(e) => setExerciseID(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" />
      </form>
    </div>
  );
}

export default DeleteExercise;

import React, { useState } from "react";
import config from "../config";
import Header from "./Header";

function CreateExercise() {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseBodyPart, setExerciseBodyPart] = useState("");
  const [exerciseEquipment, setExerciseEquipment] = useState("");
  const [exerciseGIFURL, setExerciseGIFURL] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.resourceServer}/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exerciseName: exerciseName,
        exerciseBodyPart: exerciseBodyPart,
        exerciseEquipment: exerciseEquipment,
        exerciseGIFURL: exerciseGIFURL
      }),
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          alert(`Successfully Created Exercise`)
        } else {
          alert(`Failed At Creating Exercise`)
        }
      });
    });
  }

  return (
    <div>
      <Header />
      <h1>Create Exercise</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter exerciseName:
          <input 
            type="text" 
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />
        </label>
        <br />
        <label>Enter exerciseBodyPart:
          <input 
            type="text" 
            value={exerciseBodyPart}
            onChange={(e) => setExerciseBodyPart(e.target.value)}
          />
        </label>
        <br />
        <label>Enter exerciseEquipment:
          <input 
            type="text" 
            value={exerciseEquipment}
            onChange={(e) => setExerciseEquipment(e.target.value)}
          />
        </label>
        <br />
        <label>Enter exerciseBodyPart:
          <input 
            type="text" 
            value={exerciseGIFURL}
            onChange={(e) => setExerciseGIFURL(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" />
      </form>
    </div>
  );
}

export default CreateExercise;
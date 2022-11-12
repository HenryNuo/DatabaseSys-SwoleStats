import React, { useState } from "react";
import config from "../config";
import Header from "./Header";

function SearchExercise() {
  const [exerciseBodyPart, setExerciseBodyPart] = useState("");
  const [exercises, setExercises] = useState([]);


  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.resourceServer}/exercises/searchByBodyPart/${encodeURIComponent(exerciseBodyPart)}`)
      .then((response) => response.json())
      .then((data) => {
        setExercises(data.data);
      });
  }

  return (
    <div>
      <Header />
      <h1>Search Exercises</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter exerciseBodyPart:
          <input 
            type="text" 
            value={exerciseBodyPart}
            onChange={(e) => setExerciseBodyPart(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" />
        <br />
      </form>
      <table>
        <tr>
          <th>exerciseID</th>
          <th>exerciseName</th>
          <th>exerciseBodyPart</th>
          <th>exerciseEquipment</th>
          <th>exerciseGIFURL</th>
        </tr>
        {exercises.map((exercise) => (
          <tr key={exercise.exerciseID}>
            <td>{exercise.exerciseID}</td>
            <td>{exercise.exerciseName}</td>
            <td>{exercise.exerciseBodyPart}</td>
            <td>{exercise.exerciseEquipment}</td>
            <td>{exercise.exerciseGIFURL}</td>
          </tr>
        ))}
    </table>
    </div>
  );
}

export default SearchExercise;

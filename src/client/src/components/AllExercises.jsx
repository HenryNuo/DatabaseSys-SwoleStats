import React, { useEffect, useState } from "react";
import config from "../config";
import Header from "./Header";

function AllExercise() {
  const [exercises, setExercises] = useState([]);
  
  /**
  * Calls API's required to display information on page
  */
 useEffect(() => {
   fetch(`${config.resourceServer}/exercises`)
     .then((response) => response.json())
     .then((data) => {
      console.log(data.data)
      setExercises(data.data);
     });
 }, []);

  return (
    <div>
      <Header />
      <h1>All Exercises</h1>
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

export default AllExercise;

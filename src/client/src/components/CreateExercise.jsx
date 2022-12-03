import { TextField, Stack, Button } from "@mui/material";
import React, { useState } from "react";
import config from "../config";

function CreateExercise() {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseBodyPart, setExerciseBodyPart] = useState("");
  const [exerciseEquipment, setExerciseEquipment] = useState("");
  const [exerciseGIFURL, setExerciseGIFURL] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.localServer}/exercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: exerciseName,
        body_part: exerciseBodyPart,
        equipment: exerciseEquipment,
        gif_url: exerciseGIFURL,
      }),
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          alert(`Successfully Created Exercise`);
        } else {
          alert(`Failed At Creating Exercise`);
        }
      });
    });
  };

  return (
    <Stack spacing={2}>
      <h1>Create Exercise</h1>
      <TextField
        placeholder="Exercise Name"
        value={exerciseName}
        onChange={(e) => setExerciseName(e.target.value)}
      ></TextField>
      <TextField
        placeholder="Exercise Body Part"
        value={exerciseBodyPart}
        onChange={(e) => setExerciseBodyPart(e.target.value)}
      ></TextField>
      <TextField
        placeholder="Exercise Equipment"
        value={exerciseEquipment}
        onChange={(e) => setExerciseEquipment(e.target.value)}
      ></TextField>
      <TextField
        placeholder="Exercise GIF"
        value={exerciseGIFURL}
        onChange={(e) => setExerciseGIFURL(e.target.value)}
      ></TextField>
      <Button variant="contained" onClick={handleSubmit}>
        Add Exercise
      </Button>
    </Stack>
    // <div>
    //   <h1>Add Exercise</h1>
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       Enter exerciseName:
    //       <input
    //         type="text"
    //         value={exerciseName}
    //         onChange={(e) => setExerciseName(e.target.value)}
    //       />
    //     </label>
    //     <br />
    //     <label>
    //       Enter exerciseBodyPart:
    //       <input
    //         type="text"
    //         value={exerciseBodyPart}
    //         onChange={(e) => setExerciseBodyPart(e.target.value)}
    //       />
    //     </label>
    //     <br />
    //     <label>
    //       Enter exerciseEquipment:
    //       <input
    //         type="text"
    //         value={exerciseEquipment}
    //         onChange={(e) => setExerciseEquipment(e.target.value)}
    //       />
    //     </label>
    //     <br />
    //     <label>
    //       Enter gif_url:
    //       <input
    //         type="text"
    //         value={exerciseGIFURL}
    //         onChange={(e) => setExerciseGIFURL(e.target.value)}
    //       />
    //     </label>
    //     <br />
    //     <input type="submit" />
    //   </form>
    // </div>
  );
}

export default CreateExercise;

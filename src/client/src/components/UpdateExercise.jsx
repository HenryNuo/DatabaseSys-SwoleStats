import React, { useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import config from "../config";

function UpdateExercise() {
  const [exerciseID, setExerciseID] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseBodyPart, setExerciseBodyPart] = useState("");
  const [exerciseEquipment, setExerciseEquipment] = useState("");
  const [exerciseGIFURL, setExerciseGIFURL] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.localServer}/exercise/${exerciseID}`, {
      method: "PUT",
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
          alert(`Successfully Updated Exercise`);
        } else {
          alert(`Failed At Updated Exercise`);
        }
      });
    });
  };

  return (
    <Stack spacing={2}>
      <h1>Update Exercise</h1>
      <TextField
        placeholder="Exercise ID"
        value={exerciseID}
        onChange={(e) => setExerciseID(e.target.value)}
      ></TextField>
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
        Update Exercise
      </Button>
    </Stack>
  );
}

export default UpdateExercise;

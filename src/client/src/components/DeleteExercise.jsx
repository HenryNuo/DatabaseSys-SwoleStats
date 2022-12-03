import React, { useState } from "react";
import config from "../config";
import { Button, TextField, Stack } from "@mui/material";

function DeleteExercise() {
  const [exerciseID, setExerciseID] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.localServer}/exercise/${exerciseID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          alert(`Successfully Deleted Exercise`);
        } else {
          alert(
            `Failed At Deleting Exercise:
            ${data}`
          );
        }
      });
    });
  };

  return (
    <Stack spacing={2}>
      <h1>Delete Exercise</h1>
      <TextField
        placeholder="Exercise ID"
        value={exerciseID}
        onChange={(e) => setExerciseID(e.target.value)}
      ></TextField>
      <Button variant="contained" onClick={handleSubmit}>
        Delete Exercise
      </Button>
    </Stack>
  );
}

export default DeleteExercise;

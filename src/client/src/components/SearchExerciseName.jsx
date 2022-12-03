import { TextField, Stack, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useMemo } from "react";
import config from "../config";

function SearchExercise() {
  const [exerciseBodyPart, setExerciseBodyPart] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      `${config.localServer}/exercise/searchByBodyPart/${encodeURIComponent(
        exerciseBodyPart
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setExercises(data.data);
      });
  };

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "exerciseName", headerName: "Exercise Name", width: 400 },
      {
        field: "exerciseBodyPart",
        headerName: "Exercise Body Part",
        width: 200,
      },
      {
        field: "exerciseEquipment",
        headerName: "Exercise Equipment",
        width: 200,
      },
      {
        field: "exerciseGIF",
        headerName: "Exercise GIF",
        width: 200,
        renderCell: (params) => (
          <img src={params.value} alt={""} width={70} height={70} />
        ),
      },
    ],
    []
  );

  const rows = exercises.map((exercise) => ({
    id: exercise.id,
    exerciseName: exercise.name,
    exerciseBodyPart: exercise.body_part,
    exerciseEquipment: exercise.equipment,
    exerciseGIF: exercise.gif_url,
  }));

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={2}
    >
      <h1>Search Exercises</h1>
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Search by Body Part"
          variant="outlined"
          value={exerciseBodyPart}
          onChange={(e) => setExerciseBodyPart(e.target.value)}
        ></TextField>
        <Button variant="contained" onClick={handleSubmit} sx={{ height: 50 }}>
          Search
        </Button>
      </Stack>
      <div style={{ width: "100%" }}>
        <DataGrid rows={rows} columns={columns} autoHeight />
      </div>
    </Stack>
  );
}

export default SearchExercise;

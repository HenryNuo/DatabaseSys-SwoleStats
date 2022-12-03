import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import config from "../config";
import { Stack, TextField, Button } from "@mui/material";

const ViewExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [exerciseBodyPart, setExerciseBodyPart] = useState("");

  /**
   * Calls API's required to display information on page
   */
  useEffect(() => {
    fetch(`${config.localServer}/exercise`)
      .then((response) => response.json())
      .then((data) => {
        setExercises(data.data);
      });
  }, []);

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

  const rows = useMemo(
    () =>
      exercises.map((exercise) => ({
        id: exercise.id,
        exerciseName: exercise.name,
        exerciseBodyPart: exercise.body_part,
        exerciseEquipment: exercise.equipment,
        exerciseGIF: exercise.gif_url,
      })),
    [exercises]
  );

  return (
    // center items in the stack
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
      <h1>View Exercises</h1>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight={true}
          rowHeight={80}
        />
      </div>
    </Stack>
  );
};

export default ViewExercises;

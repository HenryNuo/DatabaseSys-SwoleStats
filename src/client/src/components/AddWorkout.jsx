import React, { useEffect, useId, useState } from "react";
import { useMemo } from "react";
import config from "../config";

import { TextField, Button, Stack, Autocomplete } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DateTimeColumn = (props) => {
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [date, setDate] = React.useState(null);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={(newValue) => {
            setStartTime(newValue);
            props.handleSetStartTime(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="End Time"
          value={endTime}
          onChange={(newValue) => {
            setEndTime(newValue);
            props.handleSetEndTime(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => {
            setDate(newValue);
            props.handleSetDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Stack>
  );
};

const WorkoutColumn = (props) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Autocomplete
        disablePortal
        id="exercise-autocomplete"
        options={props.exerciseNames.map((exercise) => {
          return { label: exercise.name, id: exercise.id };
        })}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Exercises" />}
        value={props.exercise}
        onChange={(event, newValue) => {
          props.setExercise(newValue);
        }}
      />
      <TextField
        label="Set"
        type="number"
        value={props.set}
        onChange={(e) => props.setSet(e.target.value)}
      />
      <TextField
        label="Reps"
        type="number"
        value={props.reps}
        onChange={(e) => props.setReps(e.target.value)}
      />
      <TextField
        label="Weight"
        type="number"
        value={props.weight}
        onChange={(e) => props.setWeight(e.target.value)}
      />
    </Stack>
  );
};

const AddWorkout = () => {
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const [exerciseNames, setExerciseNames] = React.useState([]);

  useEffect(() => {
    fetch(`${config.localServer}/exercise/names`)
      .then((response) => response.json())
      .then((data) => {
        setExerciseNames(data.data);
        console.log("Exercise names", data.data);
      });
  }, []);

  console.log(exerciseNames);

  const [exerciseFields, setExerciseFields] = React.useState([]);
  const addExerciseField = () => {
    setExerciseFields([
      ...exerciseFields,
      {
        exercise: "",
        set: "",
        reps: "",
        weight: "",
      },
    ]);
  };

  const handleSetExercises = (newExercises) => {
    setExerciseFields(newExercises);
  };

  const handleSetStartTime = (newTime) => {
    setStartTime(newTime);
  };

  const handleSetEndTime = (newTime) => {
    setEndTime(newTime);
  };

  const handleSetDate = (newDate) => {
    setDate(newDate);
  };

  const handleSubmit = () => {
    const workout_data = {
      user_username: username,
      routine_id: null,
      date: date.format("YYYY-MM-DD"),
      start_time: startTime.format("HH:mm:ss"),
      end_time: endTime.format("HH:mm:ss"),
      weight: 150,
      workout_exercises: exerciseFields.map((exercise) => {
        return {
          exercise_id: exercise.exercise.id,
          sets: exercise.set,
          reps: exercise.reps,
          weight: exercise.weight,
        };
      }),
    };

    // Add to database
    fetch(`${config.localServer}/workout/workout_exercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout_data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("Workout added!");
      });
  };

  const [username, setUsername] = useState("");
  useEffect(() => {
    const username = JSON.parse(localStorage.getItem("username"));
    console.log(username);
    if (username) {
      setUsername(username);
    }
  }, []);

  return (
    <Stack spacing={4}>
      <h1>Add Workout</h1>
      <DateTimeColumn
        handleSetStartTime={handleSetStartTime}
        handleSetEndTime={handleSetEndTime}
        handleSetDate={handleSetDate}
      />
      {exerciseFields.map((exercisField, index) => (
        <WorkoutColumn
          key={index}
          exerciseNames={exerciseNames}
          exercise={exercisField.exercise}
          setExercise={(newExercise) => {
            const newExerciseFields = [...exerciseFields];
            newExerciseFields[index].exercise = newExercise;
            handleSetExercises(newExerciseFields);
          }}
          set={exercisField.set}
          setSet={(newSet) => {
            const newExerciseFields = [...exerciseFields];
            newExerciseFields[index].set = newSet;
            handleSetExercises(newExerciseFields);
          }}
          reps={exercisField.reps}
          setReps={(newReps) => {
            const newExerciseFields = [...exerciseFields];
            newExerciseFields[index].reps = newReps;
            handleSetExercises(newExerciseFields);
          }}
          weight={exercisField.weight}
          setWeight={(newWeight) => {
            const newExerciseFields = [...exerciseFields];
            newExerciseFields[index].weight = newWeight;
            handleSetExercises(newExerciseFields);
          }}
        />
      ))}
      <Stack
        direction="row"
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button variant="contained" onClick={addExerciseField}>
          Add Exercise
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddWorkout;

import { Stack } from "@mui/material";
import { height } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import config from "../config";

const HighestPR = (props) => {
  const columns = useMemo(
    () => [
      { field: "exercise_name", headerName: "Exercise Name", width: 400 },
      { field: "exercise_weight", headerName: "Weight", width: 200 },
    ],
    []
  );

  const rows = useMemo(
    () =>
      props.exercises.map((exercises) => ({
        id: Math.random(),
        exercise_name: exercises.name,
        exercise_weight: exercises.max_weight,
      })),
    [props.exercises]
  );

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Highest PRs for Each</h2>
      <div style={{ width: "100%" }}>
        <DataGrid rows={rows} columns={columns} autoHeight />
      </div>
    </Stack>
  );
};

const MostActive = (props) => {
  const columns = useMemo(
    () => [
      { field: "first_name", headerName: "First Name", width: 200 },
      { field: "last_name", headerName: "Last Name", width: 200 },
      { field: "num_workouts", headerName: "Number of Workouts", width: 200 },
    ],
    []
  );

  const rows = useMemo(
    () =>
      props.users.map((user) => ({
        id: Math.random(),
        first_name: user.first_name,
        last_name: user.last_name,
        num_workouts: user.number_of_workouts,
      })),
    [props.users]
  );

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Most Active Users</h2>
      <div style={{ width: "100%" }}>
        <DataGrid rows={rows} columns={columns} autoHeight />
      </div>
    </Stack>
  );
};

const Leaderboard = () => {
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [highestPRs, setHighestPRs] = useState([]);

  useEffect(() => {
    fetch(`${config.localServer}/exercise/highestPRs`)
      .then((response) => response.json())
      .then((data) => {
        setHighestPRs(data.data);
        console.log("highestPRs", data.data);
      });

    fetch(`${config.localServer}/user/mostActive`)
      .then((response) => response.json())
      .then((data) => {
        setMostActiveUsers(data.data);
        console.log(mostActiveUsers);
      });
  }, []);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Leaderboard</h1>
      <MostActive users={mostActiveUsers} />
      {console.log(highestPRs)}
      <HighestPR exercises={highestPRs} />
    </Stack>
  );
};

export default Leaderboard;

import { Stack, ListItem, ListItemText, List } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState, useMemo } from "react";
import config from "../config";

const TitleText = (props) => {
  //TODO: Get name from database
  return (
    <div>
      <h1>{"Welcome, " + props.title}</h1>
    </div>
  );
};

const ProfileUser = () => {
  const [userData, setuserData] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    const username = JSON.parse(localStorage.getItem("username"));
    console.log(username);
    if (username) {
      setUsername(username);
    }
    fetch(`${config.localServer}/user/${username}`)
      .then((response) => response.json())
      .then((data) => {
        setuserData(data.data[0]);
      });
  }, []);

  return (
    <div>
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "left",
        }}
        spacing={2}
      >
        <List
          // make list horizontal
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "left",
          }}
        >
          <ListItem>
            <ListItemText primary="Username" secondary={userData.username} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="First Name"
              secondary={userData.first_name}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Last Name" secondary={userData.last_name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Gender" secondary={userData.gender} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Age" secondary={userData.age} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Weight" secondary={userData.weight} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Height" secondary={userData.height} />
          </ListItem>
        </List>
      </Stack>
    </div>
  );
};

const HistoryGrid = (props) => {
  //TODO: Get data from database
  const columns = [
    { field: "start_time", headerName: "Start Time", width: 200 },
    { field: "end_time", headerName: "End Time", width: 200 },
    { field: "date", headerName: "Date", width: 200 },
    { field: "name", headerName: "Exercise", width: 200 },
    { field: "reps", headerName: "Reps", width: 200 },
    { field: "sets", headerName: "Sets", width: 200 },
    { field: "weight", headerName: "Weight", width: 200 },
  ];

  return (
    <div style={{ width: "100%" }}>
      <h3>Workout History</h3>
      <DataGrid rows={props.rows} columns={columns} autoHeight={true} />
    </div>
  );
};

const Home = () => {
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const username = JSON.parse(localStorage.getItem("username"));
    console.log(username);
    if (username) {
      setUsername(username);
    }
    fetch(`${config.localServer}/workoutExercise/${username}`)
      .then((response) => response.json())
      .then((data) => {
        setHistory(data.data);
        console.log(history);
      });
  }, []);

  const rows = useMemo(
    () =>
      history.map((h) => ({
        id: Math.random(),
        start_time: h.start_time,
        end_time: h.end_time,
        date: new Date(h.date).toLocaleDateString(),
        name: h.name,
        reps: h.reps,
        sets: h.sets,
        weight: h.weight,
      })),
    [history]
  );

  console.log(rows);

  console.log(history);
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
      <TitleText title={username} />
      <ProfileUser />
      <HistoryGrid rows={rows} />
    </Stack>
  );
};

export default Home;

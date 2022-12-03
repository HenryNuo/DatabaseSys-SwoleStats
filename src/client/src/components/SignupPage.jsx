import React, { useState, useEffect } from "react";
import config from "../config";
import {
  Select,
  TextField,
  Button,
  MenuItem,
  Stack,
  InputLabel,
  FormControl,
} from "@mui/material";

const CreateUser = () => {
  const [userUsername, setuserUsername] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [userFirstName, setuserFirstName] = useState("");
  const [userLastName, setuserLastName] = useState("");
  const [userGender, setuserGender] = useState("");
  const [userAge, setuserAge] = useState("");
  const [userWeight, setuserWeight] = useState("");
  const [userHeight, setuserHeight] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.localServer}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userUsername,
        password: userPassword,
        first_name: userFirstName,
        last_name: userLastName,
        gender: userGender,
        age: userAge,
        weight: userWeight,
        height: userHeight,
      }),
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          alert(`Successfully Added User`);
          // Go to home page
          window.location.href = "/home";
        } else {
          alert(`Failed At Adding User`);
        }
      });
    });
  };

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(userUsername));
  }, [userUsername]);

  return (
    <>
      <h1>User Signup</h1>

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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={userUsername}
            onChange={(e) => setuserUsername(e.target.value)}
          />

          <TextField
            label="Password"
            value={userPassword}
            onChange={(e) => setuserPassword(e.target.value)}
          />

          <TextField
            label="First Name"
            value={userFirstName}
            onChange={(e) => setuserFirstName(e.target.value)}
          />

          <TextField
            label="Last Name"
            value={userLastName}
            onChange={(e) => setuserLastName(e.target.value)}
          />

          <TextField
            label="Gender"
            value={userGender}
            onChange={(e) => setuserGender(e.target.value)}
          />

          <TextField
            label="Age"
            value={userAge}
            onChange={(e) => setuserAge(e.target.value)}
          />

          <TextField
            label="Weight"
            value={userWeight}
            onChange={(e) => setuserWeight(e.target.value)}
          />

          <TextField
            label="Height"
            value={userHeight}
            onChange={(e) => setuserHeight(e.target.value)}
          />
          {/* <input type="submit" /> */}
        </form>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </>
  );
};

export default CreateUser;

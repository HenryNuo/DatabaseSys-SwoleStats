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

const LoginUser = () => {
  const [userUsername, setuserUsername] = useState("");
  const [userPassword, setuserPassword] = useState("");

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(userUsername));
  }, [userUsername]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${config.localServer}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userUsername,
        password: userPassword,
      }),
    }).then((response) => {
      console.log(response.body);
      response.json().then((data) => {
        if (response.ok) {
          alert(`Successfully Logged In!`);
          window.location.href = "/home";
        } else {
          alert(`Login Failed, Try Again`);
        }
      });
    });
  };

  return (
    <div>
      <h1>User Login</h1>

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
    </div>
  );
};

export default LoginUser;

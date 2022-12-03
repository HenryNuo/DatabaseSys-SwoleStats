import React from "react";
import { Button, Stack } from "@mui/material";

const LandingPage = () => {
  const login = () => {
    window.location.href = "/login";
  };

  const signup = () => {
    window.location.href = "/signup";
  };
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>SwoleStats</h1>
      <Button variant="contained" onClick={login} sx={{ width: 500 }}>
        Login
      </Button>
      <Button variant="contained" onClick={signup} sx={{ width: 500 }}>
        Sign up
      </Button>
    </Stack>
  );
};

export default LandingPage;

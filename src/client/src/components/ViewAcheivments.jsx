import React, { useMemo, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import config from "../config";

const AcheivmentsGrid = (props) => {
  const columns = useMemo(() => [
    { field: "title", headerName: "Title", width: 300 },
    { field: "date", headerName: "Date", width: 200 },
  ]);

  return (
    <div style={{ width: "100%" }}>
      <DataGrid rows={props.rows} columns={columns} autoHeight />
    </div>
  );
};

const ViewAcheivments = () => {
  const [acheivments, setAcheivments] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = JSON.parse(localStorage.getItem("username"));
    console.log(username);
    if (username) {
      setUsername(username);
    }
    fetch(`${config.localServer}/userAchievement/${username}`)
      .then((response) => response.json())
      .then((data) => {
        setAcheivments(data.data);
      });
  }, []);

  const rows = useMemo(
    () =>
      acheivments.map((acheivment) => ({
        id: Math.random(),
        title: acheivment.achievement_title,
        date: new Date(acheivment.date).toLocaleDateString(),
      })),
    [acheivments]
  );

  return (
    // Center items in stack
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>View Acheivments</h1>
      <AcheivmentsGrid rows={rows} />
    </Stack>
  );
};

export default ViewAcheivments;

import React, { useMemo, useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import config from "../config";

const PersonalRecordsGrid = (props) => {
  const columns = useMemo(() => [
    { field: "name", headerName: "Exercise", width: 300 },
    { field: "weight", headerName: "Weight", width: 200 },
  ]);

  return (
    <div style={{ width: "100%" }}>
      <DataGrid rows={props.rows} columns={columns} autoHeight />
    </div>
  );
};

const PersonalRecords = () => {
  const [records, setRecords] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = JSON.parse(localStorage.getItem("username"));
    console.log(username);
    if (username) {
      setUsername(username);
    }
    fetch(`${config.localServer}/userExerciseRecord/${username}`)
      .then((response) => response.json())
      .then((data) => {
        setRecords(data.data);
      });
  }, []);

  console.log("Records", records);

  const rows = useMemo(
    () =>
      records.map((record) => ({
        id: Math.random(),
        name: record.name,
        weight: record.weight,
      })),
    [records]
  );

  console.log(rows);

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
      <h1>View Records</h1>
      <PersonalRecordsGrid rows={rows} />
    </Stack>
  );
};

export default PersonalRecords;

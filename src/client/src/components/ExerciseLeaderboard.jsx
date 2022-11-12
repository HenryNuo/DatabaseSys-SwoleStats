import React, { useEffect, useState } from "react";
import config from "../config";
import Header from "./Header";

function ExerciseLeaderboard() {
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [highestPRs, setHighestPRs] = useState([]);
  
  
  useEffect(() => {
    fetch(`${config.resourceServer}/exercises/highestPRs`)
      .then((response) => response.json())
      .then((data) => {
      setHighestPRs(data.data);
      });
    fetch(`${config.resourceServer}/user/mostActive`)
      .then((response) => response.json())
      .then((data) => {
      setMostActiveUsers(data.data);
      });
  }, []);

  return (
    <div>
      <Header />
      <h1>Leaderboard Exercise</h1>
      <div>
        <h3>Most Active Users</h3>
        <table>
          <tr>
            <th>userFirstName</th>
            <th>userLastName</th>
            <th>NumberOfGymSessions</th>
          </tr>
          {mostActiveUsers.map((user) => (
            <tr>
              <td>{user.userFirstName}</td>
              <td>{user.userLastName}</td>
              <td>{user.NumberOfGymSessions}</td>
            </tr>
          ))}
        </table>
      </div>
      <div>
        <h3>Highest PRs of Each Exercise</h3>
        <table>
          <tr>
            <th>exerciseName</th>
            <th>MAX(prWeight)</th>
          </tr>
          {highestPRs.map((pr) => (
            <tr key={pr.exerciseName}>
              <td>{pr.exerciseName}</td>
              <td>{pr["MAX(prWeight)"]}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default ExerciseLeaderboard;

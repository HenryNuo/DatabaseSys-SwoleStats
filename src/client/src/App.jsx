import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import AllExercise from "./components/AllExercises";
import CreateExercise from "./components/CreateExercise";
import DeleteExercise from "./components/DeleteExercise";
import ExerciseLeaderboard from "./components/ExerciseLeaderboard";
import SearchExercise from "./components/SearchExerciseName";
import UpdateExercise from "./components/UpdateExercise";

function App() {
  return (
    <Switch>
      <Route path="/" exact component={ExerciseLeaderboard} />
      <Route path="/all" exact component={AllExercise} />
      <Route path="/delete" exact component={DeleteExercise} />
      <Route path="/create" exact component={CreateExercise} />
      <Route path="/udpate" exact component={UpdateExercise} />
      <Route path="/search" exact component={SearchExercise} />
    </Switch>
  );
}

export default App;

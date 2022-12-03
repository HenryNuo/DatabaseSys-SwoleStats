import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Drawer from "./components/Drawer";
import Container from "@mui/material/Container";
import AddWorkout from "./components/AddWorkout";
import ViewExercises from "./components/ViewExercises";
import Home from "./components/Home";
import ViewAcheivments from "./components/ViewAcheivments";
import Leaderboard from "./components/Leaderboard";
import SearchExercise from "./components/SearchExerciseName";
import AddExercise from "./components/CreateExercise";
import EditExercise from "./components/UpdateExercise";
import DeleteExercise from "./components/DeleteExercise";
import CreateUser from "./components/SignupPage";
import LoginUser from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import PersonalRecords from "./components/PersonalRecords";
import Logout from "./components/Logout";

function App() {
  return (
    // Switch to navigate to different pages
    <Container className="App">
      <Drawer page={window.location.href} />
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/home" exact component={Home} />
        <Route path="/addworkout" exact component={AddWorkout} />
        <Route path="/viewexercises" exact component={ViewExercises} />
        <Route path="/searchexercises" exact component={SearchExercise} />
        <Route path="/addexercises" exact component={AddExercise} />
        <Route path="/editexercises" exact component={EditExercise} />
        <Route path="/deleteexercises" exact component={DeleteExercise} />
        <Route path="/viewacheivments" exact component={ViewAcheivments} />
        <Route path="/leaderboard" exact component={Leaderboard} />
        <Route path="/signup" exact component={CreateUser} />
        <Route path="/login" exact component={LoginUser} />
        <Route path="/personalrecords" exact component={PersonalRecords} />
        <Route path="/logout" exact component={Logout} />
      </Switch>
    </Container>
  );
}

export default App;

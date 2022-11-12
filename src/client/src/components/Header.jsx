import React from "react";
import { Link } from "react-router-dom";

function Header() {

  return (
    <header>
        <nav>
            <ul>
                <li><Link to="/">Leaderboard</Link></li>
                <li><Link to="/all">AllExercises</Link></li>
                <li><Link to="/create">CreateExercise</Link></li>
                <li><Link to="/delete">DeleteExercise</Link></li>
                <li><Link to="/udpate">UpdateExercise</Link></li>
                <li><Link to="/search">SearchExercise</Link></li>
            </ul>
        </nav>
    </header>
  );
}

export default Header;

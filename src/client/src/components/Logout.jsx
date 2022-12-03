import React, { useEffect, useState } from "react";

const Logout = () => {
  const [userUsername, setuserUsername] = useState("");
  const [userPassword, setuserPassword] = useState("");

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(""));
    window.location.href = "/";
  }, [userUsername]);
  return <h1>Logout</h1>;
};

export default Logout;

"use client";
import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export default function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [data, setData] = useState(false);
  const getUser = (userID) => {
    fetch("/api/dashboard/user-data", {
      method: "POST",
      body: JSON.stringify({ userID }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {        
        setData(data);
        setUserData(data?.user);
      });
  };
  const value = {
    setUserLoggedIn,
    userLoggedIn,
    userData,
    setUserData,
    data,
    getUser
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

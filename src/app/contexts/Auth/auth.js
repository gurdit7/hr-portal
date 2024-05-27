"use client"
import React, { useContext,useState } from 'react';

const AuthContext = React.createContext();


export default function useAuth (){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {    
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [addEmployee, setAddEmployee] = useState(false);
    const [userData, setUserData] = useState('');
    const [userPermissions, setPermissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [userRoles, setuserRoles] = useState(['hr','employee','admin', 'manager' , 'tl']);
    const [userNotifications, setUserNotifications] = useState('');
    const [userNotificationsLength, setUserNotificationsLength] = useState('');
    const getUserRoles = () =>{
      fetch("/api/dashboard/roles/get")
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          const values = [];
          data?.role.forEach((e)=>{
            values.push(e.role)
          })
          setuserRoles(values)
        });      
    }
    const getUserNotifications = () =>{
      fetch(`/api/dashboard/notifications?all=true&limit=3&start=0`)
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          setUserNotifications(data?.data);
          setUserNotificationsLength(data?.length);
        });      
    }  
    const getUsers = () =>{
      fetch("/api/dashboard/all-employee",{
        method: "POST",
        body: JSON.stringify({ index: 0, limit: 100000 })
      })
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          setUsers(data?.data)
        });      
    }    
    const getLeaves = (userID)=>{
      fetch(`/api/dashboard/user-data?userID=${userID}`, {
        method: 'GET',
    }).then((res) => {
        return res.json();
    }).then((res) => {
      setLeaves(res);
    }).catch((error) => {
        console.error('Error fetching user data:', error);
    });
    }    
    const value = {
        setUserLoggedIn,
        userLoggedIn,
        userData,
        setUserData,
        setPermissions,
        userPermissions,
        getUserRoles,
        userRoles,
        addEmployee,
        setAddEmployee,
        userNotifications,
        getUserNotifications,
        users,
        getUsers,
        leaves,
        getLeaves
      };
    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
}
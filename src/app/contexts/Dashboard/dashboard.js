"use client";
import React, { useContext, useState } from "react";
const DashboardContext = React.createContext();
export function useDashboard() {
  return useContext(DashboardContext);
}
export const DashboardConfiger = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [teamMembers, setTeamMembers] = useState("");
  const [addEmployee, setAddEmployee] = useState(false);
  const [userPermissions, setPermissions] = useState(false);
  const [allEmployeesData, setAllEmployees] = useState(false);
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [userRoles, setuserRoles] = useState([
    "hr",
    "employee",
    "admin",
    "manager",
    "tl",
  ]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [userNotificationsLength, setUserNotificationsLength] = useState(0);

  const getDepartments = (key) => {
    fetch(
      `/api/dashboard/departments?key=f6bb694916a535eecf64c585d4d879ad_${key}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data?.length > 0) {
          const values = [];
          data?.forEach((e) => {
            values.push(e.name);
          });
          setDepartments(values);
        }
      });
  };
  const getTeamMembers = (key,start,limit) => {
    fetch(`/api/dashboard/team?key=f6bb694916a535eecf64c585d4d879ad_${key}&st=${start}&lt=${limit}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setTeamMembers(res);
      });
  };
  const getDesignations = (key) => {
    fetch(
      `/api/dashboard/designations?key=f6bb694916a535eecf64c585d4d879ad_${key}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data?.length > 0) {
          const values = [];
          data?.forEach((e) => {
            values.push(e.name);
          });
          setDesignations(values);
        }
      });
  };
  const getUserRoles = (key) => {
    fetch(
      `/api/dashboard/roles/get?key=f6bb694916a535eecf64c585d4d879ad_${key}`
    )
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        const values = [];
        data?.role.forEach((e) => {
          values.push(e.role);
        });
        setuserRoles(values);
      });
  };

  const fetchNotifications = async (all, start, limit, email) => {
    const response = await fetch(
      `/api/dashboard/notifications?all=${all}&limit=${
        start * 5 + limit
      }&start=${start * 5}&email=${email}`
    );
    const data = await response.json();
    setUserNotifications(data?.data || []);
    setUserNotificationsLength(data?.length || 0);
  };
  const getUsers = () => {
    fetch("/api/dashboard/all-employee", {
      method: "POST",
      body: JSON.stringify({ index: 0, limit: 100000 }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        setUsers(data?.data);
      });
  };
  const getLeaves = (userID) => {
    fetch(`/api/dashboard/user-data?userID=${userID}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setLeaves(res);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };
  const getEmployees = (index, limit) =>{
    fetch("/api/dashboard/all-employee", {
        method: "POST",
        body: JSON.stringify({ index: index, limit: limit }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {     
            setAllEmployees(data)
        });
  }
  const value = {
    departments,
    getDepartments,
    setPermissions,
    userPermissions,
    getUserRoles,
    userRoles,
    addEmployee,
    setAddEmployee,
    userNotifications,
    userNotificationsLength,
    fetchNotifications,
    users,
    getUsers,
    leaves,
    getLeaves,
    designations,
    getDesignations,
    teamMembers,
    getTeamMembers,
    getEmployees,
    allEmployeesData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

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
  const [holidays, setHolidays] = useState(false);
  const [appraisals, setAppraisals] = useState([]);
  const [individualUserLeaves, setIndividualUserLeaves] = useState([]);
  const [allUsersLeaves, setAllUsersLeaves] = useState([]);
  const [userRoles, setuserRoles] = useState([
    "hr",
    "employee",
    "admin",
    "manager",
    "team-lead",
  ]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const getHolidays = (key) => {
    fetch(`/api/dashboard/holidays?key=${key}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setHolidays(res);
      });
  };
  const getDepartments = (key) => {
    fetch(`/api/dashboard/departments?key=${key}`)
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
  const getTeamMembers = (key) => {
    fetch(`/api/dashboard/team?key=${key}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setTeamMembers(res);
      });
  };
  const getDesignations = (key) => {
    fetch(`/api/dashboard/designations?key=${key}`)
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
    fetch(`/api/dashboard/roles/get?key=${key}`)
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        const values = [];
        data?.role.forEach((e) => {
          values.push(e.role);
        });
        setuserRoles(values);

        setAllPermissions(data?.role);
      });
  };
  const getAppraisal = (key, email) => {
    fetch(`/api/dashboard/appraisal?key=${key}&email=${email}`)
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        setAppraisals(data?.appraisal);        
      });
  };
  const fetchNotifications = async (key, email) => {
    const response = await fetch(
      `/api/dashboard/notifications?key=${key}&email=${email}`
    );
    const data = await response.json();
    setUserNotifications(data?.data || []);
  };

  const getLeaves = (userID) => {
    fetch(`/api/dashboard/leaves?userID=${userID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.leaves.length === 0) {
          setError(true);
        }
        setAllLeavesLength(data.length);
        setStatus(true);
        setAllLeaves(data.leaves || []);
        setLoader(false);
      });
  };
  const getEmployees = (key) => {
    fetch(`/api/dashboard/employee?key=${key}`)
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        setAllEmployees(data.leaves);
      });
  };
  const getIndividualUserLeaves = (email, key) => {
    fetch(`/api/dashboard/leaves?email=${email}&key=${key}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setIndividualUserLeaves(res?.leaves);
      });
  };
  const getAllUsersLeaves = (key) => {
    fetch(`/api/dashboard/leaves?all=true&key=${key}`)
      .then((res) => res.json())
      .then((data) => {
        setAllUsersLeaves(data);
      });
  };
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
    fetchNotifications,
    designations,
    getDesignations,
    teamMembers,
    getTeamMembers,
    getEmployees,
    allEmployeesData,
    allPermissions,
    holidays,
    getHolidays,
    getIndividualUserLeaves,
    individualUserLeaves,
    allUsersLeaves,
    getAllUsersLeaves,
    appraisals,
    getAppraisal,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

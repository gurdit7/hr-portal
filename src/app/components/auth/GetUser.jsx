"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";

const GetUserData = (session) => {
  const { setUserLoggedIn, data, getUser, userData } = useAuth();
  const {
    getDepartments,
    setPermissions,
    getUserRoles,
    getDesignations,
    getTeamMembers,
    getEmployees,
    getHolidays,
    getIndividualUserLeaves,
    getAllUsersLeaves,
    fetchNotifications,
    getAppraisal,
    fetchIndividualNotifications,
  } = useDashboard();
  const router = useRouter();
  const location = usePathname();
  useEffect(() => {
    const fetchUser = async () => {
       setTimeout(() => {
        getUserRoles(userData?._id);
        if (data?.permissions.includes("view-appraisal")) {
          getAppraisal(userData?._id, userData?.email);
        }
        if (data?.permissions.includes("user-notifications")) {
          fetchIndividualNotifications(userData?._id, userData?.email);
        }
        setUserLoggedIn(true);
        setPermissions(data?.permissions);
        if (data?.permissions.includes("read-team")) {
          getTeamMembers(userData?._id);
        }
        if (data?.permissions.includes("read-employees")) {
          getEmployees(userData?._id);
        }
        if (data?.permissions.includes("read-holidays")) {
          getHolidays(userData?._id);
        }
        if (data?.permissions.includes("user-leaves")) {
          getAllUsersLeaves(userData?._id);
        }
        if (data?.permissions.includes("view-users-notifications")) {
          fetchNotifications(userData?._id, userData?.email);
        }

        getIndividualUserLeaves(userData?.email, userData?._id);
        getDepartments(userData?._id);
        getDesignations(userData?._id);
      }, 2000);
      if (location === "/account/register" || location === "/account/login") {
        router.push("/", { scroll: false });
      }
    };  
      if(data.permissions){
      fetchUser();
      }
  }, [data]);
  useEffect(()=>{
    if (session.session !== "null") {
      const user = JSON.parse(session.session);
      getUser(user?.userID);
    } else {
      if (location === "/account/register" || location === "/account/login") {
      } else {
        router.push("/account/login", { scroll: false });
      }
    }
  },[])
  return <></>;
};

export default GetUserData;

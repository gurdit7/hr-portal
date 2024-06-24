"use client";

import useAuth from "@/app/contexts/Auth/auth";
import { useSocket } from "@/app/contexts/Socket/SocketContext";
import { useEffect, useState } from "react";
import Wrapper from "../Wrapper/Wrapper";
import Link from "next/link";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";

const RealtimeNotification = () => {
  const socket = useSocket();
  const { userData, getUser } = useAuth();
  const {
    fetchNotifications,
    getAllUsersLeaves,
    getIndividualUserLeaves,
    userPermissions,
    fetchIndividualNotifications,
    getAppraisal,
  } = useDashboard();
  const [notifications, setNotifications] = useState("");
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (userData) {
      if (socket) {
        socket.emit("joinRoom", userData?.email);
        socket.on("receiveNotification", (message) => {
          setNotifications(message);
          if (message.link.includes("leaves")) {
            if (userPermissions && userPermissions.includes("user-leaves")) {
              getAllUsersLeaves(userData?._id);
            }
            getIndividualUserLeaves(userData?.email, userData?._id);
          }
          if (
            userPermissions &&
            userPermissions.includes("view-users-notifications")
          ) {
            fetchNotifications(userData?._id, userData?.email);
          }
          if (
            userPermissions &&
            userPermissions.includes("user-notifications")
          ) {
            fetchIndividualNotifications(userData?._id, userData?.email);
          }

          if (message.link.includes("appraisal")) {
            if (
              userPermissions &&
              userPermissions.includes("view-users-appraisals")
            ) {
              getAppraisal(userData?._id);
            }
          }
          getUser(userData?.userID);
          setTimeout(() => {
            setAnimate(true);
          }, 500);
        });
      }
    }
  }, [userData]);
  const closeNotification = () => {
    setAnimate(false);
    setTimeout(() => {
      setNotifications("");
    }, 500);
  };
  return (
    <>
      {notifications && (
        <div
          className={`${
            animate ? "opacity-100  right-3" : "opacity-0  -right-full"
          } fixed  top-6 justify-center items-center z-50 outline-none focus:outline-none max-w-[576px]`}
        >
          <div
            onClick={closeNotification}
            className="flex flex-col p-4 bg-white dark:bg-accent dark:border-gray-600 shadow-md hover:shodow-lg rounded-lg border border-light-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <svg
                  className="w-10 h-10 min-w-10 min-h-10 rounded-lg p-1 border border-blue-100 text-blue-400 bg-blue-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div className="flex flex-col ml-3">
                  <div className="font-medium leading-none dark:text-white">
                    {notifications?.heading}
                  </div>
                  <p className="text-sm text-gray-500 leading-[1.3] mt-1 dark:text-white">                    
                    {notifications?.message.substring(0, 50)}{notifications?.message.length > 51 && "..."}
                  </p>
                </div>
              </div>
            </div>
            <Link
              href={notifications?.link}
              className="absolute w-full h-full top-0 left-0"
            ></Link>
          </div>
          <button
            onClick={closeNotification}
            className="w-4 h-4 bg-accent dark:border-gray-600 dark:border  flex items-center rounded-full justify-center absolute -top-[5px] -right-[5px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#fff"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default RealtimeNotification;

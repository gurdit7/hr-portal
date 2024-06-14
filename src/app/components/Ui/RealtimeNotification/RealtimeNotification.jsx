"use client";

import useAuth from "@/app/contexts/Auth/auth";
import { useSocket } from "@/app/contexts/Socket/SocketContext";
import { useEffect } from "react";

const RealtimeNotification = () => {
  const socket = useSocket();
  const { userData } = useAuth();
  useEffect(() => {
    if(userData){
    if (socket) {
      socket.emit("joinRoom", userData.email);
      socket.on("receiveNotification", (message) => {
        console.log(message);
      });
    }
  }
  }, [userData]);

  return <div></div>;
};

export default RealtimeNotification;

'use client'
import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/Socket/SocketContext';


const TestNotifications = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveNotification', (data) => {
        setNotifications((prev) => [...prev, data]);
      });
    }

    return () => {
      if (socket) {
        socket.off('receiveNotification');
      }
    };
  }, [socket]);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestNotifications;

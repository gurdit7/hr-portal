
import { useState } from 'react';
import { useSocket } from '../contexts/Socket/SocketContext';

const NotificationForm = () => {
  const socket = useSocket();
  const [message, setMessage] = useState('');

  const sendNotification = () => {
    if (socket) {
      socket.emit('sendNotification', { message });
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default NotificationForm;

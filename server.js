const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express'); // Add express to handle other middleware
const { Server } = require('socket.io');
const setupCronJobs = require('./libs/cronjobs/cronjobs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  setupCronJobs(); 

  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendNotification', (data) => {
      io.emit('receiveNotification', data);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const port = 4000 || 3000;
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

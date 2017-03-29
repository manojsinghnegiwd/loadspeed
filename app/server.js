import http from 'http';
import socketIo from 'socket.io';
import fs from 'fs';

// handle routes
const handler = (req, res) => {
  return res.end(JSON.stringify({
    message: 'hello world'
  }));
}

const app = http.createServer(handler);
const io = socketIo(app);

app.listen(8080);

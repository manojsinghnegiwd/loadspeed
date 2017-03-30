import http from 'http';
import socketIo from 'socket.io';
import fs from 'fs';
import request from 'request';
import rethinkdbdash from 'rethinkdbdash';
import express from 'express';

const r = rethinkdbdash({
  db: 'load_speed'
});

const app = express();
const io = socketIo(http.createServer(app));

app.get('/get_urls', (req, res) => {
  r.table('urls')
    .run()
    .then(urls => res.json({urls}))
    .catch(err => res.status(400).send(err));
});

r.table('urls').changes().run({
    cursor: 'true'
  },
  (err, cursor) => {
    if(cursor) {
      cursor.each((err, rec) => {
        if(rec) {
          if(rec['new_val']) {
            io.emit('new_website_tested', rec['new_val']);
          }
        }
      })
    }
  }
);

const loadPage = (url) => {
  return new Promise((res, rej) => {
    let time = Date.now();
    request(url, (err, response) => {

      time = Date.now() - time;

      if(err)
        return rej(err);

      return res({
        'statusCode': response && response.statusCode,
        'load_time': time,
        'address': url
      })

    })
  })
}

const insertIntoDB = (data) => {
  return r.table('urls').insert(data).run();
}

const sendLoadTime = (url, socketId) => {
  loadPage(url)
    .then(res => {
      insertIntoDB(res).then(success => {
        io.to(socketId).emit('end_page_load', res);
      })
    })
    .catch(err => io.to(socketId).emit('error_loading_page', err))
}

io.on('connection', (socket) => {
  socket.on('start_page_load', (data) => sendLoadTime(data.url, socket.id));
})

app.listen(7000);

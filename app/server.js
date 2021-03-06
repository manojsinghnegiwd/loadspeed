import http from 'http';
import socketIo from 'socket.io';
import fs from 'fs';
import rethinkdbdash from 'rethinkdbdash';
import express from 'express';
import {Server_port} from './config';
import phantom from 'phantom';

const r = rethinkdbdash({
  db: 'load_speed'
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/static', express.static(__dirname + '/frontEnd/static/'));

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/frontEnd/dist/index.html');
})

app.get('/get_urls', (req, res) => {
  r.table('urls')
    .orderBy({index: r.desc('checked')})
    .limit(10)
    .run()
    .then(urls => {
      r.table('urls')
        .count()
        .run()
        .then(total_count => res.json({urls, total_count}))
        .catch(err => res.status(400).send(err));
    })
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
            r.table('urls')
              .count()
              .run()
              .then(res => {
                console.log(res);
                io.emit('new_website_tested', {
                  new_url: rec['new_val'],
                  total_count: res
                });
              })
          }
        }
      })
    }
  }
);

const loadPage = (url) => {
  return new Promise((res, rej) => {
    var phInstance = null;
    phantom.create()
      .then(instance => {
          phInstance = instance;
          return instance.createPage();
      })
      .then(page => {
        let t = Date.now();
        page.open(url)
          .then((status) => {
            if (status !== 'success') {
              return rej(err);
            } else {
              t = Date.now() - t;
              phInstance.exit();
              return res({
                'statusCode': 200,
                'load_time': t,
                'address': url,
                'checked': Date.now()
              })
            }
          })
      })
      .catch(error => {
          return rej(error);
          phInstance.exit();
      });
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
  console.log('connection');
  socket.on('start_page_load', (data) => sendLoadTime(data.url, socket.id));
})

server.listen(Server_port);
io.listen(7000);

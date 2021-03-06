'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// タイムゾーンを設定する
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const app = express();

// CORSを許可する
app.use(cors());

// POSTパラメータをJSONで取得できるようにする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// public以下に配置したファイルは直リンクで見れるようにする
app.use(express.static(path.resolve(__dirname, 'public')));

// サーバーの動作確認
app.get('/time', (req, res) => {
  res.send(moment().format('YYYY/MM/DD HH:mm:ss'));
});

// サーバーを起動する
const server = app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`START SERVER http://${host}:${port}`);
});

// socketサーバーを立ち上げる
const io = require('socket.io')(server, { origins: '*:*' });

// socketイベントの設定
io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  let room = '';
  const idStore = {};  // IDとユーザ名を管理

  // ルームに参加
  socket.on('join', (data) => {
    console.log('join:', data);
    room = data.room;
    socket.join(room);
    idStore[socket.id] = { name: data.name };
    io.to(room).emit('system_message', {
      text: data.name + 'さんが参加しました'
    });
  });

  // 切断時
  socket.on('disconnect', () => {
    const id = socket.id;
    console.log('disconnected:', id);
    if (idStore[id]) {
      io.to(room).emit('system_message', {
        text: idStore[id].name + 'さんが退出しました'
      });
    }
  });

  // 自分以外のユーザにメッセージを送信
  socket.on('send_to_others', (message) => {
    console.log('send:', message);
    socket.broadcast.to(room).emit('send_to_others', message);
  });

  // 自分自身にメッセージを送信
  socket.on('send_to_myself', (message) => {
    console.log('send:', message);
    io.to(socket.id).emit('send_to_myself', message);
  });
});

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// отдаём файлы (index.html, css, js)
app.use(express.static(__dirname));

let players = {};

// подключение игрока
io.on("connection", (socket) => {
  console.log("Игрок подключился:", socket.id);

  players[socket.id] = { score: 0 };

  // отправляем всем текущее состояние
  io.emit("update", players);

  // клик игрока
  socket.on("click", () => {
    players[socket.id].score += 1;
    io.emit("update", players);
  });

  // отключение игрока
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("update", players);
  });
});

// запуск сервера
http.listen(3000, () => {
  console.log("Server running on port 3000");
});


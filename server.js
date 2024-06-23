const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Configurações básicas do servidor Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Escuta eventos de conexão do Socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Notifica todos os clientes sobre o novo usuário
  socket.broadcast.emit('user connected', 'Um novo usuário se conectou');

  // Escuta as mensagens enviadas pelo cliente
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Escuta quando o usuário está digitando
  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user);
  });

  // Trata a desconexão do cliente
  socket.on('disconnect', () => {
    io.emit('user disconnected', 'Um usuário se desconectou');
  });
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.of('/encuestas').on('connection', (socket) => {
  // Manejar la conexión de un usuario en el namespace /encuestas
  socket.on('join', (encuestaId) => {
    // Unirse a la sala correspondiente a la encuesta
    socket.join(encuestaId);
    // Enviar la pregunta actual cuando un usuario se conecta
    if (currentQuestions[encuestaId]) {
      socket.emit('question', currentQuestions[encuestaId]);
    }
  });

  // Manejar la respuesta del usuario en el namespace /encuestas
  socket.on('answer', (data) => {
    const { encuestaId, answer } = data;
    // Aquí puedes almacenar las respuestas en una base de datos o hacer otras operaciones
    console.log(`Respuesta recibida en la encuesta ${encuestaId}: ${answer}`);
    // Avisar a todos los usuarios en la misma sala sobre la respuesta
    io.of('/encuestas').to(encuestaId).emit('updateResults', answer);
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

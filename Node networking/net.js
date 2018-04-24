const server = require('net').createServer();

server.on('connection', socket => {
  console.log('Client connected');
  socket.write('Welcome new client!\n');

  socket.on('data', data => {
    console.log('data is:', data); // Buffer data
    socket.write('data is: ');
    socket.write(data);
  });

  socket.setEncoding('utf8'); // Encode data to UTF8 because buffers are expected to emit by user

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(8000, () => console.log('Server bound'));

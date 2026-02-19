import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('connected:', socket.id);
  socket.emit('message', { text: 'hello' });
});

socket.on('disconnect', () => {
  console.log('disconnected');
});

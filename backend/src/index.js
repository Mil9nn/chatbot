import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

import http from 'http'
import { Server } from 'socket.io'


import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})

app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("\\*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  });
}

app.get('/', (req, res) => {
  res.send('Socket.io server running')
})

io.on('connection', (socket) => {
  console.log("A user connected:", socket.id);

  socket.on('send-message', (data) => {
    console.log('Message reveived:', data);
    io.emit('receive-message', data);
  });

  socket.on('disconnect', (socket) => {
    console.log('User disconnected:', socket.id);
  })
})

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
  connectDB();
})

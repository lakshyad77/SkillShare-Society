const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow frontend
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notification');
const safetyRoutes = require('./routes/safety');
const otpRoutes = require('./routes/otp');

app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/auth', otpRoutes);

// Database Connection - REMOVED for In-Memory approach
console.log('Running in In-Memory Database Mode');

// Socket.io
io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    // Admin/Security joins SOS monitoring room
    socket.on('join_admin', () => {
        socket.join('admin_room');
        console.log('Admin/Security joined SOS monitoring room');
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// Make io accessible in routes
app.set('socketio', io);

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const { Server } = require("socket.io");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowed = ["http://localhost:5173", "http://localhost:3000", "https://frountend-mini-8ott4zqnb-aditya-vermas-projects-8809f241.vercel.app"];
        if (allowed.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || process.env.CLIENT_URL === origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};

module.exports = { initSocket, getIO };

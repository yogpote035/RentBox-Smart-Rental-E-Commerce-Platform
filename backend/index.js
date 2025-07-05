const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./ConnectToDatabase");
const { Server } = require("socket.io");
const http = require("http");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();
app.get("/health", (request, response) => {
  response.status(200).send("ok");
});
app.head("/health", (request, response) => {
  response.status(200).send("ok");
});
// Routes
app.use("/api/auth", require("./routes/UserRoutes"));
app.use("/api/product", require("./routes/ProductRoutes"));
app.use("/api/cart", require("./routes/CartRoutes"));
app.use("/api/order", require("./routes/OrderRoutes"));
app.use("/api/review", require("./routes/ReviewRoutes"));

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("privateMessage", ({ roomId, message, sender }) => {
    console.log(`Message from ${sender} in room ${roomId}: ${message}`);
    io.to(roomId).emit("receiveMessage", { sender, message });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server & Socket.IO listening on port ${port}`);
});

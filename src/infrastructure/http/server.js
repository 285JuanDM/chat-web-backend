// infrastructure/http/server.js
import cors from "cors";
import express from "express";
import http from "http";

import { config } from "../config/env.js";
import { authMiddleware } from "../security/jwt.js";

import { authRoutes } from "./routes/authRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { roomRoutes } from "./routes/roomRoutes.js";

import { AuthController } from "./controllers/AuthController.js";
import { MessageController } from "./controllers/MessageController.js";
import { RoomController } from "./controllers/RoomController.js";

export function createHttpServer({ authService, roomService, messageService }) {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json());

  const authCtrl = new AuthController({ authService });
  const roomCtrl = new RoomController({ roomService });
  const messageCtrl = new MessageController({ messageService });

  app.use("/auth", authRoutes(authCtrl));
  app.use("/rooms", roomRoutes(roomCtrl, authMiddleware));
  app.use("/messages", messageRoutes(messageCtrl, authMiddleware));

  server.listen(config.port, () => {
    console.log(`HTTP Server running on port ${config.port}`);
  });

  return server;
}

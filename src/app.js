// src/app.js
import express from "express";

// Controladores
import { AuthController } from "./infrastructure/http/controllers/AuthController.js";
import { RoomController } from "./infrastructure/http/controllers/RoomController.js";
import { MessageController } from "./infrastructure/http/controllers/MessageController.js";

// Rutas
import { authRoutes } from "./infrastructure/http/routes/authRoutes.js";
import { roomRoutes } from "./infrastructure/http/routes/roomRoutes.js";
import { messageRoutes } from "./infrastructure/http/routes/messageRoutes.js";

// Servicios
import { AuthService } from "./application/services/AuthService.js";
import { RoomService } from "./application/services/RoomService.js";
import { MessageService } from "./application/services/MessageService.js";

// Repos
import { PrismaClient } from "@prisma/client";
import { PostgresUserRepository } from "./infrastructure/db/PostgresUserRepository.js";
import { PostgresRoomRepository } from "./infrastructure/db/PostgresRoomRepository.js";
import { PostgresMessageRepository } from "./infrastructure/db/PostgresMessageRepository.js";

// Seguridad
import { jwtService } from "./infrastructure/security/jwt.js";
import { passwordService } from "./infrastructure/security/password.js";

export function createApp({
  authCtrl = {
    register: (req, res) => res.status(201).json({ ok: true }),
    login: (req, res) => res.status(200).json({ token: "fake" })
  },
  roomCtrl = {
    create: (req, res) => res.status(201).json({ roomId: "123" }),
  },
  messageCtrl = {
    send: (req, res) => res.status(201).json({ message: "ok" })
  },
  authMiddleware = (req, res, next) => next()
} = {}) {

  const app = express();
  app.use(express.json());

  // Aquí deben usarse funciones (faltaban los parentesis de factory)
  app.post("/auth/register", authCtrl.register);
  app.post("/auth/login", authCtrl.login);

  app.post("/rooms/private", authMiddleware, roomCtrl.create);

  app.post("/messages/send", authMiddleware, messageCtrl.send);

  return app;
}
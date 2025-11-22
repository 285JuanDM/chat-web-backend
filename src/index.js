// src/index.js

// -------------------------
// IMPORTS
// -------------------------
import { PrismaClient } from "@prisma/client";
import { config } from "./infrastructure/config/env.js";

// Repositorios (infraestructura)
import { PostgresMessageRepository } from "./infrastructure/db/PostgresMessageRepository.js";
import { PostgresRoomRepository } from "./infrastructure/db/PostgresRoomRepository.js";
import { PostgresUserRepository } from "./infrastructure/db/PostgresUserRepository.js";

// Servicios (application/services)
import { AuthService } from "./application/services/AuthService.js";
import { MessageService } from "./application/services/MessageService.js";
import { RoomService } from "./application/services/RoomService.js";

// Seguridad
import { jwtService } from "./infrastructure/security/jwt.js";
import { passwordService } from "./infrastructure/security/password.js";

// RabbitMQ
import { MessagePublisher } from "./infrastructure/broker/MessagePublisher.js";
import { MessageSubscriber } from "./infrastructure/broker/MessageSubscriber.js";
import { RabbitMQConnection } from "./infrastructure/broker/RabbitMQConnection.js";

// Servidores
import { createHttpServer } from "./infrastructure/http/server.js";
import { WebSocketServer } from "./infrastructure/websocket/WebSocketServer.js";

// -------------------------
// MAIN APP INITIALIZATION
// -------------------------
async function bootstrap() {
  console.log("🚀 Inicializando backend...");

  // ---------------------------------
  // 1. PRISMA (Base de datos Postgres)
  // ---------------------------------
 let prisma;
    try {
    prisma = new PrismaClient();
    await prisma.$connect();
    console.log("📦 Prisma conectado a Postgres.");
    } catch (e) {
    console.log("⚠️ Prisma NO conectado aún. Continuando sin detener el servidor...");
    }

  // ---------------------------------
  // 2. RabbitMQ Connection
  // ---------------------------------
  const rabbit = new RabbitMQConnection({
    url: config.rabbitUrl
  });

  await rabbit.connect();

  const queues = {
    newMessage: "messages.new",
    userJoined: "rooms.user_joined",
    userLeft: "rooms.user_left"
  };

  // Declarar colas
  await rabbit.assertQueue(queues.newMessage);
  await rabbit.assertQueue(queues.userJoined);
  await rabbit.assertQueue(queues.userLeft);

  console.log("📨 RabbitMQ conectado y colas declaradas.");

  // ---------------------------------
  // 3. Instanciación de repositorios
  // ---------------------------------
  const userRepo = new PostgresUserRepository(prisma);
  const roomRepo = new PostgresRoomRepository(prisma);
  const messageRepo = new PostgresMessageRepository(prisma);

  // ---------------------------------
  // 4. Publisher para mensajes (Rabbit)
  // ---------------------------------
  const messagePublisher = new MessagePublisher({
    rabbitMQ: rabbit,
    queues
  });

  // ---------------------------------
  // 5. Services (application/services)
  // ---------------------------------
  const authService = new AuthService({
    userRepository: userRepo,
    passwordService,
    jwtService
  });

  const roomService = new RoomService({
    roomRepository: roomRepo,
    userRepository: userRepo
  });

  const messageService = new MessageService({
    roomRepository: roomRepo,
    messageRepository: messageRepo,
    messagePublisher
  });

  // ---------------------------------
  // 6. Servidor HTTP (Express)
  // ---------------------------------
  const httpServer = createHttpServer({
    authService,
    roomService,
    messageService
  });

  console.log("🌐 Servidor HTTP listo.");

  // ---------------------------------
  // 7. WebSocket Server
  // ---------------------------------
  const wsServer = new WebSocketServer({
    server: httpServer,
    roomService,
    messageService
  });

  wsServer.start();
  console.log("🔌 WebSocket Server listo.");

  // ---------------------------------
  // 8. RabbitMQ Consumer (guardar mensajes)
  // ---------------------------------
  const subscriber = new MessageSubscriber({
    rabbitMQ: rabbit,
    queues,
    messageRepository: messageRepo
  });

  await subscriber.start();
  console.log("📥 Subscriber de RabbitMQ escuchando mensajes…");

  console.log("🚀 Backend inicializado completamente.");
}

// Ejecutar bootstrap()
bootstrap()
  .catch((err) => {
    console.error("❌ Error al iniciar backend:", err);
    process.exit(1);
  });

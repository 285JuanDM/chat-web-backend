import { WebSocketServer as WSS } from "ws";
import { jwtService } from "../security/jwt.js";

export class WebSocketServer {
  constructor({ server, roomService, messageService }) {
    this.wss = new WSS({ server });
    this.roomService = roomService;
    this.messageService = messageService;

    this.clients = new Map();

    this.rooms = new Map();
  }

  start() {
    this.wss.on("connection", (socket, req) => {
      const token = this.extractToken(req);

      try {
        const user = jwtService.verifyToken(token);

        this.clients.set(socket, user);

        socket.on("message", (msg) => this.handleMessage(socket, msg));
        socket.on("close", () => this.cleanup(socket));

        socket.send(JSON.stringify({ event: "connected", user }));
      } catch (err) {
        socket.send(JSON.stringify({ error: "Invalid token" }));
        socket.close();
      }
    });

    console.log("[WebSocket] Running");
  }

  extractToken(req) {
    const params = new URLSearchParams(req.url.replace("/?", ""));
    return params.get("token");
  }

  cleanup(socket) {
    this.clients.delete(socket);

    // Remove user from all rooms
    for (const [roomId, sockets] of this.rooms.entries()) {
      sockets.delete(socket);
      if (sockets.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  broadcast(roomId, payload, excludeSocket = null) {
    const sockets = this.rooms.get(roomId);
    if (!sockets) return;

    for (const s of sockets) {
      if (s !== excludeSocket && s.readyState === s.OPEN) {
        s.send(JSON.stringify(payload));
      }
    }
  }

  async handleMessage(socket, raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      socket.send(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    const { event, data } = parsed;
    const user = this.clients.get(socket);

    if (!user) {
      socket.close();
      return;
    }

    switch (event) {
      case "join_room": {
        const { roomId } = data;

        // Add socket to the room map
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(socket);

        await this.roomService.join({ roomId, userId: user.id });

        socket.send(JSON.stringify({ event: "joined_room", data }));
        break;
      }

      case "leave_room": {
        const { roomId } = data;

        if (this.rooms.has(roomId)) {
          this.rooms.get(roomId).delete(socket);
        }

        await this.roomService.leave({ roomId, userId: user.id });

        socket.send(JSON.stringify({ event: "left_room", data }));
        break;
      }

      case "send_message": {
        const { roomId, content } = data;

        if (!this.rooms.has(roomId) || !this.rooms.get(roomId).has(socket)) {
          socket.send(JSON.stringify({ error: "You are not in this room" }));
          return;
        }

        const message = await this.messageService.send({
          roomId,
          userId: user.id,
          content,
        });

        const payload = {
          event: "new_message",
          data: {
            id: message.id,
            roomId,
            user,
            content,
            createdAt: message.createdAt,
          },
        };

        this.broadcast(roomId, payload, socket);

        socket.send(JSON.stringify(payload));
        break;
      }

      default:
        socket.send(JSON.stringify({ error: "Unknown event" }));
    }
  }
}

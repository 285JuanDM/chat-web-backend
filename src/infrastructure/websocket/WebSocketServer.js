import { WebSocketServer as WSS } from "ws";
import { jwtService } from "../security/jwt.js";

export class WebSocketServer {
  constructor({ server, roomService, messageService }) {
    this.wss = new WSS({ server });
    this.roomService = roomService;
    this.messageService = messageService;
    this.clients = new Map();
  }

  start() {
    this.wss.on("connection", (socket, req) => {
      const token = this.extractToken(req);

      try {
        const user = jwtService.verifyToken(token);
        this.clients.set(socket, user);

        socket.on("message", (msg) => this.handleMessage(socket, msg));
        socket.on("close", () => this.clients.delete(socket));
      } catch (err) {
        socket.close();
      }
    });

    console.log("[WebSocket] Running");
  }

  extractToken(req) {
    const params = new URLSearchParams(req.url.replace("/?", ""));
    return params.get("token");
  }

  async handleMessage(socket, raw) {
    const { event, data } = JSON.parse(raw);
    const user = this.clients.get(socket);

    switch (event) {
      case "join_room":
        await this.roomService.join({ roomId: data.roomId, userId: user.id });
        break;

      case "leave_room":
        await this.roomService.leave({ roomId: data.roomId, userId: user.id });
        break;

      case "send_message":
        await this.messageService.send({
          roomId: data.roomId,
          userId: user.id,
          content: data.content
        });
        break;
    }
  }
}

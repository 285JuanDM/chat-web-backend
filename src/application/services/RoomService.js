// application/services/RoomService.js
import { createRoom } from "../use-cases/createRoom.js";
import { joinRoom } from "../use-cases/joinRoom.js";
import { leaveRoom } from "../use-cases/leaveRoom.js";

export class RoomService {
  constructor({ roomRepository, userRepository }) {
    this.createRoomUC = createRoom({ roomRepository });
    this.joinRoomUC = joinRoom({ roomRepository, userRepository });
    this.leaveRoomUC = leaveRoom({ roomRepository });
  }

  async create(data) {
    return this.createRoomUC(data);
  }

  async join(data) {
    return this.joinRoomUC(data);
  }

  async leave(data) {
    return this.leaveRoomUC(data);
  }
}

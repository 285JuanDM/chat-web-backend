import { createRoom } from "../uses-cases/createRoom.js";
import { joinRoom } from "../uses-cases/joinRoom.js";
import { leaveRoom } from "../uses-cases/leaveRoom.js";

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

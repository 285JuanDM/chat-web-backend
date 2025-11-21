// infrastructure/db/PostgresRoomRepository.js
import { RoomRepository } from "../../domain/repositories/RoomRepository.js";

export class PostgresRoomRepository extends RoomRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  findById(id) {
    return this.prisma.room.findUnique({ where: { id } });
  }

  create(roomData) {
    return this.prisma.room.create({ data: roomData });
  }

  addUserToRoom(roomId, userId) {
    return this.prisma.roomMember.create({
      data: { roomId, userId }
    });
  }

  removeUserFromRoom(roomId, userId) {
    return this.prisma.roomMember.deleteMany({
      where: { roomId, userId }
    });
  }

  async isUserInRoom(roomId, userId) {
    const member = await this.prisma.roomMember.findFirst({
      where: { roomId, userId }
    });
    return Boolean(member);
  }
}

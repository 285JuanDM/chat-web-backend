// infrastructure/db/PostgresMessageRepository.js
import { MessageRepository } from "../../domain/repositories/MessageRepository.js";

export class PostgresMessageRepository extends MessageRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  save(messageData) {
    return this.prisma.message.create({
      data: messageData
    });
  }

  getMessagesByRoom(roomId, { limit, offset }) {
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { timestamp: "desc" },
      skip: offset,
      take: limit
    });
  }
}

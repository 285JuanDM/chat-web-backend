export class MessageRepository {
  async save(messageData) {
    throw new Error("MessageRepository.save not implemented");
  }

  async getMessagesByRoom(roomId, { limit, offset }) {
    throw new Error("MessageRepository.getMessagesByRoom not implemented");
  }
}

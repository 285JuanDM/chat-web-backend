export class Message {
  constructor({ id, roomId, userId, content, timestamp }) {
    this.id = id;
    this.roomId = roomId;
    this.userId = userId;
    this.content = content;
    this.timestamp = timestamp;
  }
}

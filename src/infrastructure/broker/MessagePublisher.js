// infrastructure/broker/MessagePublisher.js
export class MessagePublisher {
  constructor({ rabbitMQ, queues }) {
    this.rabbitMQ = rabbitMQ;
    this.queues = queues;
  }

  async publishNewMessage(messagePayload) {
    await this.rabbitMQ.publish(this.queues.newMessage, messagePayload);
  }

  async publishUserJoined(payload) {
    await this.rabbitMQ.publish(this.queues.userJoined, payload);
  }

  async publishUserLeft(payload) {
    await this.rabbitMQ.publish(this.queues.userLeft, payload);
  }
}

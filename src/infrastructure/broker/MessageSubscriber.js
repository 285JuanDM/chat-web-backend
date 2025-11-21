// infrastructure/broker/MessageSubscriber.js
export class MessageSubscriber {
  constructor({ rabbitMQ, queues, messageRepository }) {
    this.rabbitMQ = rabbitMQ;
    this.queues = queues;
    this.messageRepository = messageRepository;
  }

  async start() {
    // Cuando llegue un mensaje nuevo desde sendMessage.js
    await this.rabbitMQ.consume(this.queues.newMessage, async (msg) => {
      await this.messageRepository.save(msg);
    });
  }
}

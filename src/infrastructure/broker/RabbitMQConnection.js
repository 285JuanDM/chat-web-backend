// infrastructure/broker/RabbitMQConnection.js
import amqplib from "amqplib";

export class RabbitMQConnection {
  constructor({ url }) {
    this.url = url;
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (this.connection) return;

    this.connection = await amqplib.connect(this.url);
    this.channel = await this.connection.createChannel();

    console.log("[RabbitMQ] Connected");
  }

  async assertQueue(queueName) {
    await this.channel.assertQueue(queueName, { durable: true });
  }

  async publish(queue, message) {
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
  }

  async consume(queue, callback) {
    await this.channel.consume(queue, (msg) => {
      const data = JSON.parse(msg.content.toString());
      callback(data);
      this.channel.ack(msg);
    });
  }
}

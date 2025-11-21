// application/services/MessageService.js
import { sendMessage } from "../use-cases/sendMessage.js";
import { getMessageHistory } from "../use-cases/getMessageHistory.js";

export class MessageService {
  constructor({ roomRepository, messageRepository, messagePublisher }) {
    this.sendMessageUC = sendMessage({
      roomRepository,
      messagePublisher
    });

    this.getHistoryUC = getMessageHistory({
      messageRepository
    });
  }

  async send(data) {
    return this.sendMessageUC(data);
  }

  async getHistory(data) {
    return this.getHistoryUC(data);
  }
}

import { getMessageHistory } from "../uses-cases/getMessageHistory.js";
import { sendMessage } from "../uses-cases/sendMessage.js";

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

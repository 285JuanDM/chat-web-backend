import { jest } from "@jest/globals";
import { sendMessage } from "../../src/application/uses-cases/sendMessage.js";

describe("MessageService - Unit Tests", () => {
  test("envía un mensaje correctamente", async () => {
    const roomRepository = {
      findById: jest.fn().mockResolvedValue({ id: 1 }),
      isUserInRoom: jest.fn().mockResolvedValue(true)
    };

    const messagePublisher = {
      publishNewMessage: jest.fn().mockResolvedValue(true)
    };

    const sendMessageUC = sendMessage({ roomRepository, messagePublisher });

    await sendMessageUC({
      roomId: 1,
      userId: 1,
      content: "Hola"
    });

    expect(roomRepository.findById).toHaveBeenCalled();
    expect(roomRepository.isUserInRoom).toHaveBeenCalled();
    expect(messagePublisher.publishNewMessage).toHaveBeenCalled();
  });
});

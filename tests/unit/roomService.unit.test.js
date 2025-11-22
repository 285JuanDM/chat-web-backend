import { jest } from "@jest/globals";
import { createRoom } from "../../src/application/uses-cases/createRoom.js";

describe("RoomService", () => {
  test("crea una sala privada", async () => {
    const roomRepository = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: "Test Room",
        isPrivate: true,
        ownerId: 1
      })
    };

    const createRoomUC = createRoom({ roomRepository });

    const result = await createRoomUC({
      name: "Test Room",
      isPrivate: true,
      ownerId: 1
    });

    expect(roomRepository.create).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });
});

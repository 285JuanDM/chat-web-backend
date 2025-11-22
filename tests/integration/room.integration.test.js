import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp();

describe("Rooms API", () => {
  test("Crea una sala privada", async () => {
    const res = await request(app)
      .post("/rooms/private")
      .send({
        ownerId: "1",
        participants: ["1", "2"]
      });

    expect(res.status).toBe(201);
  });
});

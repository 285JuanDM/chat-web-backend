import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp();

describe("Messages API", () => {
  test("Envía un mensaje", async () => {
    const res = await request(app)
      .post("/messages/send")
      .send({
        roomId: "1",
        userId: "1",
        content: "Hola desde test"
      });

    expect(res.status).toBe(201);
  });
});

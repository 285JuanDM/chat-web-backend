import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp();  

describe("User API", () => {
  test("registro de usuario funciona", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "nuevo@mail.com", password: "1234" });

    expect(res.statusCode).toBe(201);
  });
});

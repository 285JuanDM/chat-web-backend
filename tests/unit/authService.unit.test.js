import { jest } from "@jest/globals";
import { loginUser } from "../../src/application/uses-cases/loginUser.js";

describe("AuthService", () => {
  test("login devuelve token", async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: "test@mail.com",
        password: "hashedPass"
      })
    };

    const passwordService = {
      compare: jest.fn().mockResolvedValue(true) // ← ESTE NOMBRE ES CLAVE
    };

    const jwtService = {
      generateToken: jest.fn().mockReturnValue("TOKEN123")
    };

    const loginUC = loginUser({ userRepository, passwordService, jwtService });

    const result = await loginUC({
      email: "test@mail.com",
      password: "1234"
    });

    expect(passwordService.compare).toHaveBeenCalled();
    expect(jwtService.generateToken).toHaveBeenCalled();
    expect(result.token).toBe("TOKEN123");
  });
});

// application/services/AuthService.js
import { loginUser } from "../use-cases/loginUser.js";

export class AuthService {
  constructor({ userRepository, passwordService, jwtService }) {
    this.loginUser = loginUser({
      userRepository,
      passwordService,
      jwtService
    });
  }

  async login(data) {
    return this.loginUser(data);
  }
}

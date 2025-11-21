import { loginUser } from "../uses-cases/loginUser.js";
import { registerUser } from "../uses-cases/registerUser.js";

export class AuthService {
  constructor({ userRepository, passwordService, jwtService }) {
    this.loginUser = loginUser({
      userRepository,
      passwordService,
      jwtService
    });

    this.registerUser = registerUser({
      userRepository,
      passwordService
    });
  }

  async login(data) {
    return this.loginUser(data);
  }

  async register(data) {
    return this.registerUser(data);
  }
}

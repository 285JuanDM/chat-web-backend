export class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  register = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const result = await this.authService.register({
        username,
        email,
        password,
      });

      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

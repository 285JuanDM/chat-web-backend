export class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

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

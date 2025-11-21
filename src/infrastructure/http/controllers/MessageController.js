export class MessageController {
  constructor({ messageService }) {
    this.messageService = messageService;
  }

  history = async (req, res) => {
    try {
      const roomId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const history = await this.messageService.getHistory({
        roomId,
        page,
        limit
      });

      res.json(history);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

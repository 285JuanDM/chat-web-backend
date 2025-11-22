export class RoomController {
  constructor({ roomService }) {
    this.roomService = roomService;
  }

  getAll = async (req, res) => {
    try {
      const rooms = await this.roomService.getAll();
      res.json(rooms);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  create = async (req, res) => {
    try {
      const { name, isPrivate } = req.body;
      const ownerId = req.user.id;

      const room = await this.roomService.create({ name, isPrivate, ownerId });

      res.json(room);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  join = async (req, res) => {
    try {
      const roomId = req.params.id;
      const userId = req.user.id;

      const result = await this.roomService.join({ roomId, userId });

      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  leave = async (req, res) => {
    try {
      const roomId = req.params.id;
      const userId = req.user.id;

      const result = await this.roomService.leave({ roomId, userId });

      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

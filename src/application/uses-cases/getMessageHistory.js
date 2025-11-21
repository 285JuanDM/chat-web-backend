export function getMessageHistory({ messageRepository }) {
  return async function execute({ roomId, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    const messages = await messageRepository.getMessagesByRoom(roomId, {
      limit,
      offset
    });

    return {
      page,
      limit,
      messages
    };
  };
}

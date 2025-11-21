export function sendMessage({ roomRepository, messagePublisher }) {
  return async function execute({ roomId, userId, content }) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw new Error("Room not found");

    const isMember = await roomRepository.isUserInRoom(roomId, userId);
    if (!isMember) throw new Error("User not in room");

    const messagePayload = {
      roomId,
      userId,
      content,
      timestamp: Date.now()
    };

    // publicamos mensaje a RabbitMQ
    await messagePublisher.publishNewMessage(messagePayload);

    return { message: "Message sent", payload: messagePayload };
  };
}

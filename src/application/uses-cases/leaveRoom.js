export function leaveRoom({ roomRepository }) {
  return async function execute({ roomId, userId }) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw new Error("Room not found");

    const member = await roomRepository.isUserInRoom(roomId, userId);
    if (!member) throw new Error("User is not in this room");

    await roomRepository.removeUserFromRoom(roomId, userId);

    return { message: "User left the room" };
  };
}

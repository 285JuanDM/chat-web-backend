export function joinRoom({ roomRepository, userRepository }) {
  return async function execute({ roomId, userId }) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw new Error("Room not found");

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const alreadyMember = await roomRepository.isUserInRoom(roomId, userId);
    if (alreadyMember) return { message: "Already joined" };

    await roomRepository.addUserToRoom(roomId, userId);

    return { message: "User joined the room" };
  };
}

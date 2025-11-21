export function createRoom({ roomRepository }) {
  return async function execute({ name, isPrivate, ownerId }) {
    const room = await roomRepository.create({
      name,
      isPrivate,
      ownerId
    });

    return room;
  };
}

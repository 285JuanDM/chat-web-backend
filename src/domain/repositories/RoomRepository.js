export class RoomRepository {
  async findById(id) {
    throw new Error("RoomRepository.findById not implemented");
  }

  async create(roomData) {
    throw new Error("RoomRepository.create not implemented");
  }

  async addUserToRoom(roomId, userId) {
    throw new Error("RoomRepository.addUserToRoom not implemented");
  }

  async removeUserFromRoom(roomId, userId) {
    throw new Error("RoomRepository.removeUserFromRoom not implemented");
  }

  async isUserInRoom(roomId, userId) {
    throw new Error("RoomRepository.isUserInRoom not implemented");
  }
}
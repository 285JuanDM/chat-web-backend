import { prisma } from "./client.js";

export class UserRepositoryPrisma {
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async create({ username, email, password }) {
    return prisma.user.create({
      data: { username, email, password }
    });
  }
}

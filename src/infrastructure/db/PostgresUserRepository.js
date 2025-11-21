// infrastructure/db/PostgresUserRepository.js
import { UserRepository } from "../../domain/repositories/UserRepository.js";

export class PostgresUserRepository extends UserRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  findById(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(userData) {
    return this.prisma.user.create({ data: userData });
  }
}

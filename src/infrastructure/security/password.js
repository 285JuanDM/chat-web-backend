import bcrypt from "bcrypt";

export const passwordService = {
  hash(password) {
    return bcrypt.hash(password, 10);
  },

  compare(password, hashed) {
    return bcrypt.compare(password, hashed);
  }
};

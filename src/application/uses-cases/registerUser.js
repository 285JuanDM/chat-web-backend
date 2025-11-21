export function registerUser({ userRepository, passwordService }) {
  return async function ({ username, email, password }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error("El usuario ya existe");

    const hashed = await passwordService.hash(password);

    const user = await userRepository.create({
      username,
      email,
      password: hashed
    });

    return {
      message: "Usuario registrado con éxito",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  };
}

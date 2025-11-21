export function loginUser({ userRepository, passwordService, jwtService }) {
  return async function execute({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const validPassword = await passwordService.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid credentials");

    const token = jwtService.generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  };
}

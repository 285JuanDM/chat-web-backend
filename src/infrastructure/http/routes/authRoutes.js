import { Router } from "express";

export function authRoutes(controller) {
  const router = Router();

  router.post("/login", controller.login);
  router.post("/register", controller.register);

  return router;
}

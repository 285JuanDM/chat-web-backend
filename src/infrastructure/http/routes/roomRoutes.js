import { Router } from "express";

export function roomRoutes(controller, authMiddleware) {
  const router = Router();

  router.post("/", authMiddleware, controller.create);
  router.post("/:id/join", authMiddleware, controller.join);
  router.post("/:id/leave", authMiddleware, controller.leave);

  return router;
}

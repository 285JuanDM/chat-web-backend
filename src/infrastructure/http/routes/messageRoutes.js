import { Router } from "express";

export function messageRoutes(controller, authMiddleware) {
  const router = Router();

  router.get("/:id/history", authMiddleware, controller.history);

  return router;
}

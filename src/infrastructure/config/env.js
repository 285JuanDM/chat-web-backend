// infrastructure/config/env.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",
  jwtSecret: process.env.JWT_SECRET || "supersecret"
};


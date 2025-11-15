// config/prisma.js
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: [
    // 生产不输出 query，所以我们监听即可
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "warn" }
  ]
});

// 监听 SQL 输出（只在开发模式）
prisma.$on("query", (e) => {
  if (process.env.NODE_ENV === "development") {
    console.log("SQL:", e.query);
  }
});

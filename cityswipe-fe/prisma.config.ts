import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";

if (existsSync(".env")) loadEnvFile(".env");
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL && process.env.DIRECT_URL !== "..."
      ? process.env.DIRECT_URL : process.env.DATABASE_URL,
  },
});

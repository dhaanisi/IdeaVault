import { defineConfig } from "prisma/config";
import { keys } from "./keys";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: keys().DATABASE_URL,
  },

  migrations: {
    path: "prisma/migrations",
  },
});
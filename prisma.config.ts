import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  "postgresql://powerchain:powerchain@127.0.0.1:5432/powerchain?schema=public";

export default defineConfig({
  schema: "database/prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});

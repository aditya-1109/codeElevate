import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import { apiRouter } from "./router/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Mount API router
app.use("/api", apiRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "CodeElevate Student Workspace API is online" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
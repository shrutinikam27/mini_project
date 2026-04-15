import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL environment variable is not set. Database queries will fail.");
}


const databaseUrl = process.env.DATABASE_URL || "postgres://localhost/db";

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

export default db;


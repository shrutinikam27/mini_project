import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export default db;

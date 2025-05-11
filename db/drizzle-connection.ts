import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db;

try {
    const sql = neon(process.env.DATABASE_URL!);
    db = drizzle(sql, { schema });
} catch (error) {
    console.error("Error connecting to Neon database:", error);
    throw error;
}

export default db;

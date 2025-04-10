import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database...");
        // Clear existing data
        await db.delete(schema.courses);
        await db.delete(schema.userProgress);

        // Insert courses with unique IDs
        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Spanish",
                imageSrc: "/spanish.jpg",
            },
            {
                id: 2,
                title: "Italian",
                imageSrc: "/italian.jpg",
            },
            {
                id: 3,
                title: "Korean",
                imageSrc: "/korean.jpg",
            },
            {
                id: 4,
                title: "Japanese",
                imageSrc: "/japan.png",
            },
        ]);

        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("failed to seed the database");
    }
};

main();
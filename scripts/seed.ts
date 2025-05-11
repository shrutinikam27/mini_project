import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            console.log("Starting database seeding...");

            // Clear existing data
            await db.delete(schema.courses);
            await db.delete(schema.userProgress);
            await db.delete(schema.units);
            await db.delete(schema.lessons);
            await db.delete(schema.challenges);
            await db.delete(schema.challengeOptions);
            await db.delete(schema.challengeProgress);

            // Insert courses
            await db.insert(schema.courses).values([
                { id: 1, title: "Spanish", imageSrc: "/spanish.jpg" },
                { id: 2, title: "Italian", imageSrc: "/italian.jpg" },
                { id: 3, title: "Korean", imageSrc: "/korean.jpg" },
                { id: 4, title: "Japanese", imageSrc: "/japan.png" },
            ]);

            // Insert units
            await db.insert(schema.units).values([
                {
                    id: 1,
                    courseId: 1,
                    title: "unit1",
                    description: "Learn the basics of spanish",
                    order: 1,
                }
            ]);

            // Insert lessons
            await db.insert(schema.lessons).values([
                { id: 1, unitId: 1, order: 1, title: "Nouns" },
                { id: 2, unitId: 1, order: 2, title: "Verbs" },
                { id: 3, unitId: 1, order: 3, title: "Verbs" },
                { id: 4, unitId: 1, order: 4, title: "Verbs" },
                { id: 5, unitId: 1, order: 5, title: "Verbs" }
            ]);

            // Insert challenges
            await db.insert(schema.challenges).values([
                {
                    id: 1,
                    lessonId: 1,
                    type: "SELECT",
                    order: 1,
                    question: 'Which one of these is "the man"?',
                },
                {
                    id: 2,
                    lessonId: 1,
                    type: "ASSIST",
                    order: 2,
                    question: '"the man"',
                },
                {
                    id: 3,
                    lessonId: 1,
                    type: "SELECT",
                    order: 3,
                    question: 'Which one of these is "the robot"?',
                },
            ]);

            // Insert challenge options
            await db.insert(schema.challengeOptions).values([
                {
                    challengeId: 1,
                    imageSrc: "/man.svg",
                    correct: true,
                    text: "el hombre",
                    audioSrc: "/es_man.mp3",
                },
                {
                    challengeId: 1,
                    imageSrc: "/woman.svg",
                    correct: false,
                    text: "la mujer",
                    audioSrc: "/es_woman.mp3",
                },
                {
                    challengeId: 1,
                    imageSrc: "/el-robot.png",
                    correct: false,
                    text: "el robot",
                    audioSrc: "/es_robot.mp3",
                },
                {
                    challengeId: 2,
                    correct: true,
                    text: "el hombre",
                    audioSrc: "/es_man.mp3",
                },
                {
                    challengeId: 2,
                    correct: false,
                    text: "la mujer",
                    audioSrc: "/es_woman.mp3",
                },
                {
                    challengeId: 2,
                    correct: false,
                    text: "el robot",
                    audioSrc: "/es_robot.mp3",
                },
                {
                    challengeId: 3,
                    imageSrc: "/man.svg",
                    correct: false,
                    text: "el hombre",
                    audioSrc: "/es_man.mp3",
                },
                {
                    challengeId: 3,
                    imageSrc: "/woman.svg",
                    correct: false,
                    text: "la mujer",
                    audioSrc: "/es_woman.mp3",
                },
                {
                    challengeId: 3,
                    imageSrc: "/el-robot.png",
                    correct: true,
                    text: "el robot",
                    audioSrc: "/es_robot.mp3",
                },
            ]);

            console.log("Database seeding completed successfully!");
            break;
        } catch (error) {
            console.error(`Error during database seeding on attempt ${attempt + 1}:`, error);
            attempt++;
            if (attempt >= MAX_RETRIES) {
                console.error("Max retries reached. Failed to seed the database.");
                throw new Error("Failed to seed the database");
            }
            console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
            await delay(RETRY_DELAY_MS);
        }
    }
};

main();

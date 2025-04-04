
import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    UserProgress: many(userProgress),
}));

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("user"),
    userImageSrc: text("user_image_src").notNull().default("/logo1.png"),
    activeCourseId: integer("active_course_id").references(() => courses.
        id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("hearts").notNull().default(0),
});
export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourses: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));



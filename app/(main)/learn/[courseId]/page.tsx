"use client";

import React, { useEffect } from "react";

const CourseLearnPage = ({ params }: { params: { courseId: string } }) => {
    const courseId = params.courseId;

    useEffect(() => {
        // Placeholder: You can fetch course data here or redirect as needed
        console.log("Course Learn Page for courseId:", courseId);
    }, [courseId]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Learn Course: {courseId}</h1>
            {/* Add course learning content here */}
        </div>
    );
};

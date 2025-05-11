import { test, expect } from '@playwright/test';

test.describe('Lesson Navigation and Completion Flow', () => {
    test('should unlock second lesson after completing first lesson', async ({ page }) => {
        // Go to the learn page for course 1
        await page.goto('http://localhost:3001/learn/1');

        // Verify first lesson is unlocked and clickable
        // Update selector to match actual first lesson title
        const firstLesson = page.locator('text=First Lesson Title'); // Replace with actual first lesson title
        await expect(firstLesson).toBeVisible();
        await expect(firstLesson).toHaveAttribute('href', '/lesson/1');

        // Verify second lesson is locked initially
        const secondLesson = page.locator('text=Second Lesson Title'); // Replace with actual second lesson title
        await expect(secondLesson).toHaveClass(/opacity-50/);

        // Click first lesson and complete it (simulate quiz completion)
        await firstLesson.click();

        // Simulate completing the quiz - this depends on your quiz UI
        // For example, click all correct answers and submit
        // This part needs to be customized based on your quiz implementation

        // After completion, verify redirect to next lesson
        await expect(page).toHaveURL(/\/lesson\/2/);

        // Go back to learn page and verify second lesson is now unlocked
        await page.goto('http://localhost:3001/learn/1');
        await expect(secondLesson).not.toHaveClass(/opacity-50/);
    });
});

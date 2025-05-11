# Test info

- Name: Lesson Navigation and Completion Flow >> should unlock second lesson after completing first lesson
- Location: D:\mini_project\lingo\tests\lessonNavigation.spec.ts:4:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=Nouns')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text=Nouns')

    at D:\mini_project\lingo\tests\lessonNavigation.spec.ts:10:35
```

# Page snapshot

```yaml
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- dialog "Build Error":
  - text: Build Error
  - button "Copy Stack Trace":
    - img
  - button "No related documentation found" [disabled]:
    - img
  - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools":
    - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
    - img
  - paragraph: "Error: × Expected unicode escape"
  - img
  - text: ./app/(main)/learn/[courseId]/page.tsx
  - button "Open in editor":
    - img
  - text: "Error: × Expected unicode escape ╭─[D:\\mini_project\\lingo\\app\\(main)\\learn\\[courseId]\\page.tsx:14:1] 11 │ useEffect(() => { 12 │ async function fetchLessons() { 13 │ try { 14 │ const response = await fetch(\\`/api/public/courses/\\${courseId}\\`); · ▲ 15 │ if (response.ok) { 16 │ const courseData = await response.json(); 16 │ if (courseData && courseData.units) { ╰──── Caused by: Syntax Error"
  - contentinfo:
    - paragraph: This error occurred during the build process and can only be dismissed by fixing the error.
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 15.2.4 (stale)":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 15.2.4 (stale)
- img
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Lesson Navigation and Completion Flow', () => {
   4 |     test('should unlock second lesson after completing first lesson', async ({ page }) => {
   5 |         // Go to the learn page for course 1
   6 |         await page.goto('http://localhost:3001/learn/1');
   7 |
   8 |         // Verify first lesson is unlocked and clickable
   9 |         const firstLesson = page.locator('text=Nouns');
> 10 |         await expect(firstLesson).toBeVisible();
     |                                   ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  11 |         await expect(firstLesson).toHaveAttribute('href', '/lesson/1');
  12 |
  13 |         // Verify second lesson is locked initially
  14 |         const secondLesson = page.locator('text=Second Lesson Title'); // Replace with actual title
  15 |         await expect(secondLesson).toHaveClass(/opacity-50/);
  16 |
  17 |         // Click first lesson and complete it (simulate quiz completion)
  18 |         await firstLesson.click();
  19 |
  20 |         // Simulate completing the quiz - this depends on your quiz UI
  21 |         // For example, click all correct answers and submit
  22 |         // This part needs to be customized based on your quiz implementation
  23 |
  24 |         // After completion, verify redirect to next lesson
  25 |         await expect(page).toHaveURL(/\/lesson\/2/);
  26 |
  27 |         // Go back to learn page and verify second lesson is now unlocked
  28 |         await page.goto('http://localhost:3001/learn/1');
  29 |         await expect(secondLesson).not.toHaveClass(/opacity-50/);
  30 |     });
  31 | });
  32 |
```
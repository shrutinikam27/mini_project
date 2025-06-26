# Test info

- Name: Lesson Navigation and Completion Flow >> should unlock second lesson after completing first lesson
- Location: D:\mini_project\lingo\tests\lessonNavigation.spec.ts:4:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text="Nouns"')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text="Nouns"')

    at D:\mini_project\lingo\tests\lessonNavigation.spec.ts:14:35
```

# Page snapshot

```yaml
- region "Notifications alt+T"
- link "Mascot Era":
  - /url: /learn
  - img "Mascot"
  - heading "Era" [level=1]
- link "Learn Learn":
  - /url: /learn
  - img "Learn"
  - text: Learn
- link "Leaderboard Leaderboard":
  - /url: /leaderboard
  - img "Leaderboard"
  - text: Leaderboard
- link "Quests Quests":
  - /url: /quests
  - img "Quests"
  - text: Quests
- link "Shop Shop":
  - /url: /shop
  - img "Shop"
  - text: Shop
- main:
  - heading "Language Courses" [level=1]
  - paragraph
  - paragraph: Spanish
  - paragraph
  - paragraph: Italian
  - paragraph
  - paragraph: Korean
  - paragraph
  - paragraph: Japanese
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Lesson Navigation and Completion Flow', () => {
   4 |     test('should unlock second lesson after completing first lesson', async ({ page }) => {
   5 |         // Increase timeout for navigation and test
   6 |         test.setTimeout(60000);
   7 |
   8 |         // Go to the learn page for course 1
   9 |         await page.goto('http://localhost:3001/learn/1', { waitUntil: 'networkidle' });
  10 |
  11 |         // Verify first lesson is unlocked and clickable
  12 |         // Update selector to match actual lesson title or use a more generic selector
  13 |         const firstLesson = page.locator('text="Nouns"');
> 14 |         await expect(firstLesson).toBeVisible();
     |                                   ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  15 |         await firstLesson.click();
  16 |
  17 |         // Simulate completing the first lesson (this depends on your app's UI)
  18 |         // For example, click a "Complete Lesson" button if exists
  19 |         // await page.click('button:has-text("Complete Lesson")');
  20 |
  21 |         // Wait for UI to update after completion
  22 |         await page.waitForTimeout(2000);
  23 |
  24 |         // Verify second lesson is unlocked
  25 |         // Update selector to match actual second lesson title
  26 |         const secondLesson = page.locator('text="Second Lesson Title"');
  27 |         await expect(secondLesson).toBeVisible();
  28 |         await expect(secondLesson).not.toHaveClass(/locked/);
  29 |
  30 |         // Optionally, click second lesson to verify navigation
  31 |         // await secondLesson.click();
  32 |         // await expect(page).toHaveURL(/learn\/1\/lesson\/2/);
  33 |     });
  34 | });
  35 |
```
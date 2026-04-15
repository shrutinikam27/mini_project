# Unlocking the Second Unit Logic in a Learning Application

## Overview
To unlock the second unit in a course, the application needs to verify that all lessons in the first unit are completed by the user. This ensures a sequential learning path where users must complete earlier content before progressing.

## Steps to Implement Unlocking Logic

1. **Fetch Units and Lessons with Completion Status**
   - Retrieve the list of units and their associated lessons.
   - Each lesson should have a `completed` boolean indicating if the user has finished it.

2. **Check Completion of All Lessons in the Previous Unit**
   - For the second unit (index 1), check if all lessons in the first unit (index 0) are completed.
   - Use a method like `Array.every()` to verify all lessons have `completed === true`.

3. **Set Locked Status on Units**
   - The first unit is always unlocked.
   - For subsequent units, set `locked` to `true` if the previous unit's lessons are not all completed.
   - Otherwise, set `locked` to `false`.

4. **Pass Locked Status to Unit Component**
   - The `Unit` component should accept a `locked` prop.
   - When `locked` is `true`, the UI should visually indicate the unit is locked and disable interaction.

## Example Code Snippet

```tsx
// In LearnPage component
const unitsWithLockStatus = units.map((unit, index) => {
  if (index === 0) return { ...unit, locked: false };
  const prevUnit = units[index - 1];
  const allPrevLessonsCompleted = prevUnit.lessons.every(lesson => lesson.completed);
  return { ...unit, locked: !allPrevLessonsCompleted };
});

// Pass locked prop to Unit component
unitsWithLockStatus.map(unit => (
  <Unit
    key={unit.id}
    {...unit}
    locked={unit.locked}
  />
));
```

## Unit Component Handling

```tsx
type UnitProps = {
  locked?: boolean;
  // other props
};

const Unit = ({ locked = false, lessons, ...props }: UnitProps) => {
  return (
    <div className={locked ? "opacity-50 pointer-events-none" : ""}>
      {/* Render lessons */}
    </div>
  );
};
```

## Summary
This approach ensures that users cannot access the second unit until they have completed all lessons in the first unit, enforcing a structured learning progression.

If you want, I can help you implement or review this logic in your codebase.

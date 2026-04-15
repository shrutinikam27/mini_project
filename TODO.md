# TODO: Fix TypeScript Errors

- [x] Install @types/http-errors to resolve module declaration errors
- [x] Update app/api/lessons/[lessonId]/route.ts: Change import from 'getIsAdmin' to 'isAdmin' and ensure isAdmin() is awaited in all usages
- [x] Update app/api/units/[unitId]/route.ts: Change import to 'isAdmin' and ensure isAdmin() is awaited in all usages
- [x] Fix HttpError usage in app/api/courses/route.ts
- [x] Fix HttpError usage in app/api/units/route.ts
- [x] Fix HttpError usage in app/api/challenges/route.ts
- [x] Fix HttpError usage in app/api/lessons/route.ts
- [x] Fix admin import and usage in app/api/challengeOptions/[challengeOptionId]/route.ts, app/api/challengeOptions/route.ts, app/api/challenges/[challengeId]/route.ts, app/api/challenges/route.ts, app/api/courses/[courseId]/route.ts, app/api/lessons/route.ts
- [x] Verify that all TypeScript errors are resolved

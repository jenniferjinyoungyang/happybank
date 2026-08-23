---
name: test-coverage-enforcement
description: >-
  Use this skill whenever you are tasked with adding unit tests, fixing code,
  or writing new features to ensure 100% unit test coverage of target files.
---

# Test Coverage Enforcement Skill

This skill provides step-by-step procedures and strategies to achieve **100% unit test coverage** (statements, branches, functions, and lines) for all new and modified files in the HappyBank codebase.

---

## 1. Running Tests and Collecting Coverage

Jest is configured to collect coverage automatically. Run the following commands to check current coverage:

*   **Run all tests and print the coverage report:**
    ```bash
    npm test
    ```
*   **Run coverage for a specific file or directory:**
    ```bash
    npx jest --coverage app/api/memories/route.test.ts
    ```
*   **Run tests in watch mode (interactive):**
    ```bash
    npm run test:watch
    ```

---

## 2. Analyzing the Coverage Report

After running tests, Jest prints a coverage table to the console and generates reports in the `coverage/` directory:

1.  **Console Output Table**: Look for the `Uncovered Line #s` column. It tells you exactly which lines or ranges of code are not covered by the current tests.
2.  **HTML Report**: Open `coverage/lcov-report/index.html` in a browser or view files inside `coverage/lcov-report/` to inspect a line-by-line visual view of covered (green) and uncovered (red) lines and branch paths.

> [!TIP]
> A file can have 100% statement coverage but less than 100% branch coverage. Always check branch coverage (e.g., ternary operators, `switch` blocks, or logical short-circuiting like `&&`).

---

## 3. Strategies for Reaching 100% Coverage

To cover every single line, branch, and edge case, use the following techniques:

### A. Mocking Third-Party & Core Dependencies
HappyBank integrates with Auth.js (NextAuth), Prisma, Cloudinary, and the Google Gemini SDK. Mock these to isolate your tests and simulate different scenarios:

*   **Mocking Prisma**:
    Use mock functions for Database client calls:
    ```typescript
    jest.mock('@/lib/prisma', () => ({
      prisma: {
        memory: {
          findMany: jest.fn(),
          create: jest.fn(),
        },
      },
    }));
    ```
*   **Mocking NextAuth / Session**:
    ```typescript
    jest.mock('next-auth/react', () => ({
      useSession: () => ({ data: { user: { email: 'test@happybank.com' } }, status: 'authenticated' }),
    }));
    ```
*   **Mocking Google GenAI / Gemini API**:
    ```typescript
    jest.mock('@google/genai', () => {
      return {
        GoogleGenAI: jest.fn().mockImplementation(() => ({
          models: {
            generateContent: jest.fn().mockResolvedValue({ text: 'mock response' }),
          },
        })),
      };
    });
    ```

### B. Testing Catch Blocks & Error Handling
To get 100% coverage, you must test the `catch (error)` statements. Force mocks to reject or throw errors:

```typescript
// Example: Mocking database failure to cover error-handling paths
import { prisma } from '@/lib/prisma';

(prisma.memory.create as jest.Mock).mockRejectedValueOnce(new Error('Database connection failed'));

const response = await POST(request);
expect(response.status).toBe(500);
```

### C. Covering Branch Variations
Ensure all branch outcomes (both truthy and falsy paths) are tested:
*   **Short-circuit operators**: For `const x = a || b`, write one test where `a` is truthy, and another where `a` is falsy.
*   **Optional Chaining**: For `user?.profile?.name`, write tests where `user` is undefined, `profile` is undefined, and when all properties are defined.
*   **Ternary Operators & If-Else**: Cover both paths explicitly with separate test blocks.

### D. Component State & User Interactions (RTL)
For frontend UI components in React:
*   Use `@testing-library/react` and `@testing-library/user-event` to simulate real user interactions (e.g., `userEvent.click()`, `userEvent.type()`).
*   Verify that error validation states are rendered when invalid inputs are provided.
*   Verify loading states and transitions when submitting forms.

### E. Avoiding 'any' Types in Tests
To prevent ESLint `@typescript-eslint/no-explicit-any` errors:
*   Do not use the `any` type.
*   Use `unknown` for variables containing raw parsed payloads, request bodies, or dynamic mock inputs.
*   Use standard TypeScript casting (`as typeof someFunction` or specific types like `jest.Mock`) instead of casting objects or functions to `any`.
*   Type cast process.env overrides using `(process.env as Record<string, string | undefined>)` rather than `(process.env as any)`.

---

## 4. Verification Checklist

Before considering a testing or implementation task complete, go through this checklist:

- [ ] Run `npm test` and verify that all tests pass.
- [ ] Inspect the console coverage table specifically for files you created or modified.
- [ ] Verify that **% Stmts**, **% Branch**, **% Funcs**, and **% Lines** are all **100** for those target files.
- [ ] If any files have uncovered lines, write targeted tests to cover them and run tests again.

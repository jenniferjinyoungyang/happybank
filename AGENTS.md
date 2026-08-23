# HappyBank AI Agent Guidelines

Welcome, agent! This document defines critical repository-wide constraints and guidelines that you MUST follow when modifying or extending this codebase.

## 1. Unit Testing & 100% Test Coverage Requirement

> [!IMPORTANT]
> **All new features, bug fixes, and file modifications MUST be accompanied by unit tests that achieve 100% test coverage.**
> This applies to **lines, branches, functions, and statements** of all created or modified files.

*   **Before committing/completing work**: You must run the tests and inspect the coverage report to verify that coverage on modified/new files is exactly **100%**.
*   **No exceptions**: Unless explicitly instructed by the user in their prompt or via a specific config override, do not settle for partial coverage.

## 2. Test Verification Workflow

We have a dedicated Workspace Skill designed specifically to guide you through testing and coverage workflows:
*   Activate and read the [`test-coverage-enforcement`](file:///Users/yuri/Coding/Projects/happybank/.agents/skills/test-coverage-enforcement/SKILL.md) skill.
*   This skill outlines how to run Jest with coverage, analyze the reports to find uncovered code paths, and resolve common test coverage gaps.

## 3. General Development Guidelines

*   **Keep existing code intact**: Do not remove unrelated code comments, logging, or styling.
*   **Follow clean coding practices**: Use TS/JS best practices, proper TypeScript typing, and modular component design.
*   **Avoid Using the 'any' Type**: Do not use the `any` type in application code or tests to prevent ESLint TypeScript errors (`@typescript-eslint/no-explicit-any`). Instead, use precise TypeScript types, interfaces, or standard type-assertion castings (like `unknown`, `Record<string, unknown>`, or mock types).

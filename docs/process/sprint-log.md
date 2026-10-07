# Sprint Log

## Sprint 0 — Foundation
- **Goal:** a clean Vite + TypeScript + Vitest scaffold that installs, tests, builds and deploys an empty shell to Pages.
- **Scope:** scaffold, architecture skeleton, message catalogue, UI shell with no features, Pages workflow (backlog.md).
- **Started:** 2026-10-07 17:25 UTC
- **Finished:** 2026-10-07 17:42 UTC
- **Delivered:** scaffold (Vite 8, TypeScript 6 strict, Vitest 4, jsdom), message catalogue (18 IDs), shared types, featureless shell, Pages workflow; 20/20 tests green; deploy run 2 succeeded.
- **QA:** docs/process/qa-reports/sprint-0.md. 31 PASS; 1 FAIL (DEF-S0-1, engines range) fixed in f91282d and re-tested PASS; 3 MANUAL (live-site checks; the container's proxy blocks github.io, so the PO checks them).
- **Open:** DEF-S0-2 (README Node wording) is for docs-writer at Stage 8.

## Sprint 1 — MVP (Must)
- **Goal:** a Bill Settler can split a bill with a tip, sees who covers the leftover cent, and can fix any figure and recalculate.
- **Stories, in build order:** S-1 → S-2 → S-3 → S-4 (backlog.md).
- **Started:** 2026-10-07 17:43 UTC

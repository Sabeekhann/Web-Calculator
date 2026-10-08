#!/usr/bin/env node
// CI evidence (ADR-009): turns test JSON reports into GitHub Actions annotations, which the
// REST API exposes on the check run even when job logs and artifacts are out of reach.
//   node scripts/ci-summary.mjs          -> per-project Playwright counts (test-results/e2e-results.json)
//   node scripts/ci-summary.mjs --unit   -> Vitest counts (test-results/unit-results.json)
// Dependency-free. Always exits 0: the test steps themselves fail the job.
import { readFileSync } from 'node:fs';

const E2E_FILE = 'test-results/e2e-results.json';
const UNIT_FILE = 'test-results/unit-results.json';

/** Escapes workflow-command data (%, CR, LF) per the GitHub Actions spec. */
function escapeData(text) {
  return String(text).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

/** Escapes workflow-command property values (also ':' and ','). */
function escapeProperty(text) {
  return escapeData(text).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

function annotate(level, title, message) {
  console.log(`::${level} title=${escapeProperty(title)}::${escapeData(message)}`);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
}

/** Yields every Playwright test entry (one per spec × project) in a report's nested suites. */
function* playwrightTests(suites) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) yield* spec.tests ?? [];
    yield* playwrightTests(suite.suites);
  }
}

const STATUS_KEY = { expected: 'passed', unexpected: 'failed', flaky: 'flaky', skipped: 'skipped' };

function emptyCounts() {
  return { passed: 0, failed: 0, flaky: 0, skipped: 0 };
}

function formatCounts(c) {
  return `${c.passed} passed, ${c.failed} failed, ${c.flaky} flaky, ${c.skipped} skipped`;
}

function summariseE2e() {
  const report = readJson(E2E_FILE);
  if (report === undefined) {
    annotate('warning', 'E2E', 'no results file');
    return;
  }
  const byProject = new Map();
  const total = emptyCounts();
  for (const test of playwrightTests(report.suites)) {
    const key = STATUS_KEY[test.status] ?? 'failed'; // unknown status counts as a failure, never a pass
    const name = test.projectName || '(default)';
    if (!byProject.has(name)) byProject.set(name, emptyCounts());
    byProject.get(name)[key] += 1;
    total[key] += 1;
  }
  for (const [name, counts] of [...byProject].sort(([a], [b]) => a.localeCompare(b))) {
    annotate(counts.failed > 0 ? 'error' : 'notice', `E2E ${name}`, formatCounts(counts));
  }
  annotate(total.failed > 0 ? 'error' : 'notice', 'E2E total', formatCounts(total));
  const globalErrors = report.errors?.length ?? 0;
  if (globalErrors > 0) annotate('error', 'E2E', `${globalErrors} error(s) outside tests`);
}

function summariseUnit() {
  const report = readJson(UNIT_FILE);
  if (report === undefined) {
    annotate('warning', 'Unit', 'no results file');
    return;
  }
  const passed = report.numPassedTests ?? 0;
  const failed = report.numFailedTests ?? 0;
  const skipped = (report.numPendingTests ?? 0) + (report.numTodoTests ?? 0);
  const message = `${passed} passed, ${failed} failed, ${skipped} skipped (${report.testResults?.length ?? 0} test file(s))`;
  annotate(failed > 0 ? 'error' : 'notice', 'Unit', message);
}

if (process.argv.includes('--unit')) summariseUnit();
else summariseE2e();

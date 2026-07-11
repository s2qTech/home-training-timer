"use strict";

const assert = require("node:assert/strict");
const core = require("../timer-session-core.js");

assert.equal(core.activeSecondsAfterTick(12.5, 0.25), 12.75);
assert.equal(core.activeSecondsAfterTick(-5, 3), 3);

const finished = core.finalizeTiming(
  { startedAt: "2026-07-11T10:00:00.000Z" },
  90.4,
  "2026-07-11T10:05:00.000Z"
);
assert.deepEqual(finished, {
  actualSeconds: 90,
  elapsedSeconds: 300,
  pausedSeconds: 210
});

const malformed = core.finalizeTiming(
  { startedAt: "invalid" },
  30,
  "2026-07-11T10:05:00.000Z"
);
assert.deepEqual(malformed, {
  actualSeconds: 0,
  elapsedSeconds: 0,
  pausedSeconds: 0
});

console.log("timer-session-core tests passed");

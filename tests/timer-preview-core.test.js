"use strict";

const assert = require("node:assert/strict");
const core = require("../timer-preview-core.js");

const steps = [
  { key: "march", sourceStepId: "march", phase: "warmup", name: "March", seconds: 60 },
  { key: "calf:prepare", sourceStepId: "calf_stretch", phase: "prepare", name: "Calf stretch", seconds: 8, executionPart: "prepare" },
  { key: "calf:left", sourceStepId: "calf_stretch", phase: "left", actionPhase: "stretch", name: "Calf stretch", seconds: 30, executionPart: "side" },
  { key: "calf:switch", sourceStepId: "calf_stretch", phase: "switch", name: "Switch right", seconds: 6, executionPart: "switch" },
  { key: "calf:right", sourceStepId: "calf_stretch", phase: "right", actionPhase: "stretch", name: "Calf stretch", seconds: 30, executionPart: "side" },
  { key: "rest", phase: "rest", name: "Rest", seconds: 20 },
  { key: "finish", phase: "finish", name: "Finish", seconds: 1 }
];

const groups = core.buildStepGroups(steps);
assert.equal(groups.length, 3);
assert.deepEqual(groups.map((group) => [group.type, group.actionNumber, group.seconds, group.name]), [
  ["action", 1, 60, "March"],
  ["action", 2, 74, "Calf stretch"],
  ["rest", null, 20, "Rest"]
]);
assert.equal(groups[1].previewIndex, 2);
assert.deepEqual(core.getActionProgress(steps, 1), { current: 2, total: 2 });
assert.deepEqual(core.getActionProgress(steps, 5), { current: 2, total: 2 });

console.log("timer preview core tests passed");

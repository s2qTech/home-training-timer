"use strict";

const assert = require("node:assert/strict");
const core = require("../timer-execution-core.js");

assert.deepEqual(core.expandAction({ name: "March", seconds: 60 }), [{
  keySuffix: "action", seconds: 60, name: "March", dose: "", executionPart: null, side: null, speechText: ""
}]);

const prepared = core.expandAction({
  name: "Bridge",
  seconds: 45,
  execution: { mode: "prepare_only", prepareSeconds: 8 }
});
assert.deepEqual(prepared.map(item => [item.executionPart, item.seconds]), [["prepare", 8], [null, 45]]);

const bilateral = core.expandAction({
  name: "Calf stretch",
  seconds: 30,
  dose: "30 seconds per side",
  execution: { mode: "bilateral_hold", prepareSeconds: 8, sideSeconds: 30, switchSeconds: 6, sides: ["left", "right"] }
});
assert.deepEqual(bilateral.map(item => [item.executionPart, item.phase, item.seconds]), [
  ["prepare", "准备", 8], ["side", "left", 30], ["switch", "换侧", 6], ["side", "right", 30]
]);
assert.equal(bilateral.reduce((total, item) => total + item.seconds, 0), 74);
assert.equal(core.normalizeExecution({ mode: "unknown" }).mode, "simple");

console.log("timer execution core tests passed");

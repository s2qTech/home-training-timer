"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "contracts", "v1");
const schema = JSON.parse(fs.readFileSync(path.join(root, "contract.schema.json"), "utf8"));
const fixtures = JSON.parse(fs.readFileSync(path.join(root, "contract-fixtures.json"), "utf8"));
const page = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

assert.equal(schema.properties.contractVersion.const, "1.0");
assert.equal(fixtures.contractVersion, schema.properties.contractVersion.const);
assert.ok(schema.$defs.entity.enum.includes("timer_sessions"));
assert.equal(schema.$defs.recordEnvelope.allOf.length, schema.$defs.entity.enum.length);
assert.ok(schema.$defs.trainingType.enum.includes(fixtures.recordEnvelope.data.trainingType));
assert.ok(schema.$defs.timerCompletion.enum.includes(fixtures.recordEnvelope.data.completion));
assert.match(page, /const SHENKE_CONTRACT_VERSION = "1\.0"/);
assert.match(page, /contractVersion: SHENKE_CONTRACT_VERSION/);
assert.match(page, /contractVersion: options\.body\.contractVersion \|\| SHENKE_CONTRACT_VERSION/);
assert.match(page, /entities: \["routine_templates"\], limit: 200, cursor/);
assert.match(page, /if \(needsTimer !== null\) return needsTimer;/);
assert.match(page, /return true;\s*\/\/ routine_templates are executable by default|routine_templates are executable by default/);
assert.match(page, /step\.keyPoints \?\? step\.key_points \?\? step\.points/);
assert.match(page, /step\.safetyNotes \?\? step\.safety_notes \?\? step\.cautions/);
assert.match(page, /rawStep: clonePlainData\(step\)/);
assert.match(page, /ROUTINE_CATALOG_CACHE_KEY = "home-training-timer:routine-catalog-cache:v3"/);
assert.match(page, /function hasExecutableRoutineDefinition\(/);
assert.match(page, /schema: "timer-routine-cache\/v3"/);
assert.match(page, /payload\.schema !== "timer-routine-cache\/v3"/);
assert.match(page, /function applyUnavailableRoutineCatalog\(/);
assert.match(page, /function normalizeRoutineLifecycle\(/);
assert.match(page, /function inferRoutineTrainingType\(/);
assert.match(page, /function inferRoutineScene\(/);
assert.match(page, /function clearRoutineCatalogCache\(/);
assert.match(page, /云端暂无可执行的训练方案/);
assert.match(page, /当前流程没有可执行动作/);
assert.match(page, /type: "shenke\.timer\.ready"/);

console.log("timer contract v1 tests passed");

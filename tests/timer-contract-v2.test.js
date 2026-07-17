"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "contracts", "v2");
const schema = JSON.parse(fs.readFileSync(path.join(root, "contract.schema.json"), "utf8"));
const fixtures = JSON.parse(fs.readFileSync(path.join(root, "contract-fixtures.json"), "utf8"));
const page = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

assert.equal(schema.properties.contractVersion.const, "2.0");
assert.equal(fixtures.contractVersion, "2.0");
assert.equal(fixtures.synthetic, true);
assert.ok(schema.$defs.entity.enum.includes("status_checkins"));
assert.ok(schema.$defs.entity.enum.includes("daily_reviews"));
assert.ok(schema.$defs.entity.enum.includes("plan_import_batches"));

const routine = fixtures.records.find(record => record.entity === "routine_templates");
const session = fixtures.records.find(record => record.entity === "timer_sessions");
assert.ok(routine);
assert.ok(session);
assert.equal(routine.data.scene, "recovery");
assert.equal(routine.data.role, "recovery");
assert.equal(routine.data.steps[0].futureCompatibleField, "preserve-me");
assert.equal(session.data.devicePlatform, "android");
assert.equal(session.data.activeSeconds + session.data.pausedSeconds, session.data.elapsedSeconds);

// Production remains v1 during migration. The v2 mirror proves additive reads
// before the timer is allowed to switch its write envelope.
assert.match(page, /const SHENKE_CONTRACT_VERSION = "1\.0"/);
assert.match(page, /templateContractVersion === "2\.0"/);
assert.match(page, /role: explicitRole/);
assert.match(page, /rawTemplate: clonePlainData\(template\)/);
assert.match(page, /Contract v2 流程缺少有效 scene/);
assert.match(page, /Contract v2 流程缺少有效 role/);

console.log("timer contract v2 compatibility tests passed");

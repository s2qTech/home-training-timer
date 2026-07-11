"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const page = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const inlineScripts = Array.from(page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g));
const appScript = inlineScripts.at(-1)?.[1] || "";

assert.match(page, /<script src="\.\/timer-session-core\.js"><\/script>/);
assert.doesNotMatch(page, /el\.(cues|warnings|planNote)\.innerHTML\s*=/);
assert.match(page, /function renderTextList\(/);
assert.match(page, /function renderPlanNote\(/);
assert.match(page, /completeTimerSession\("stopped"\)/);
assert.match(page, /window\.addEventListener\("pagehide"/);
assert.doesNotThrow(() => new Function(appScript));

console.log("timer page contract tests passed");

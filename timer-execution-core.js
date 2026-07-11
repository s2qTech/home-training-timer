(function attachTimerExecutionCore(globalScope, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalScope) globalScope.HomeTrainingTimerExecutionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createTimerExecutionCore() {
  const MODES = new Set(["simple", "prepare_only", "alternating", "bilateral_hold", "bilateral_reps"]);

  function positiveSeconds(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.round(number) : fallback;
  }

  function nonNegativeSeconds(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? Math.round(number) : fallback;
  }

  function normalizeExecution(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return { mode: "simple" };
    const mode = String(value.mode || "simple").trim() || "simple";
    return {
      mode: MODES.has(mode) ? mode : "simple",
      prepareSeconds: nonNegativeSeconds(value.prepareSeconds ?? value.prepare_seconds),
      sideSeconds: positiveSeconds(value.sideSeconds ?? value.side_seconds, null),
      switchSeconds: nonNegativeSeconds(value.switchSeconds ?? value.switch_seconds),
      sides: Array.isArray(value.sides)
        ? value.sides.map(item => String(item || "").trim()).filter(Boolean)
        : []
    };
  }

  function expandAction(input) {
    const name = String(input?.name || input?.stepId || "动作");
    const seconds = positiveSeconds(input?.seconds, 1);
    const dose = String(input?.dose || "");
    const execution = normalizeExecution(input?.execution);
    const action = { keySuffix: "action", seconds, name, dose, executionPart: null, side: null, speechText: "" };

    if (execution.mode === "simple") return [action];

    const prepared = execution.prepareSeconds > 0
      ? [{
        keySuffix: "prepare",
        phase: "准备",
        seconds: execution.prepareSeconds,
        name,
        dose: "摆好姿势，准备开始。",
        executionPart: "prepare",
        side: null,
        speechText: `准备，${name}`
      }]
      : [];

    if (execution.mode === "prepare_only" || execution.mode === "alternating") return [...prepared, action];

    const left = execution.sides[0] || "左侧";
    const right = execution.sides[1] || "右侧";
    const sideSeconds = execution.sideSeconds || Math.max(1, Math.round(seconds / 2));
    const sideDose = dose || `保持 ${sideSeconds} 秒`;
    const switchPart = execution.switchSeconds > 0
      ? [{
        keySuffix: "switch",
        phase: "换侧",
        seconds: execution.switchSeconds,
        name: `换${right}`,
        dose: `换到${right}，准备下一侧。`,
        executionPart: "switch",
        side: right,
        speechText: `换${right}`
      }]
      : [];

    return [
      ...prepared,
      {
        keySuffix: "left",
        phase: left,
        seconds: sideSeconds,
        name,
        dose: sideDose,
        executionPart: "side",
        side: left,
        speechText: `${left}，${name}`
      },
      ...switchPart,
      {
        keySuffix: "right",
        phase: right,
        seconds: sideSeconds,
        name,
        dose: sideDose,
        executionPart: "side",
        side: right,
        speechText: `${right}，${name}`
      }
    ];
  }

  return { normalizeExecution, expandAction };
});

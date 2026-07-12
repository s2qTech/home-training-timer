(function attachTimerPreviewCore(globalScope, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalScope) globalScope.HomeTrainingTimerPreviewCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createTimerPreviewCore() {
  function buildStepGroups(steps) {
    const groups = [];
    let current = null;
    let actionNumber = 0;

    (Array.isArray(steps) ? steps : []).forEach((step, index) => {
      if (!step || step.key === "finish") return;
      const isRest = step.key === "rest";
      const joinKey = isRest ? `rest:${index}` : `${step.round || ""}:${step.sourceStepId || step.key}`;
      const canJoin = current
        && current.type === "action"
        && !isRest
        && current.joinKey === joinKey
        && (current.hasExecution || step.executionPart);

      if (!canJoin) {
        if (!isRest) actionNumber += 1;
        current = {
          type: isRest ? "rest" : "action",
          actionNumber: isRest ? null : actionNumber,
          joinKey,
          startIndex: index,
          endIndex: index,
          seconds: 0,
          steps: [],
          previewIndex: null,
          hasExecution: Boolean(step.executionPart),
          phase: step.actionPhase || step.phase,
          name: step.name,
          round: step.round || null
        };
        groups.push(current);
      }

      current.steps.push(step);
      current.endIndex = index;
      current.seconds += Number(step.seconds) || 0;
      current.hasExecution = current.hasExecution || Boolean(step.executionPart);
      if (!["prepare", "switch"].includes(step.executionPart)) {
        if (current.previewIndex === null) current.previewIndex = index;
        current.phase = step.actionPhase || step.phase;
        current.name = step.name;
      }
    });

    groups.forEach((group) => {
      if (group.previewIndex === null) group.previewIndex = group.startIndex;
    });
    return groups;
  }

  function getActionProgress(steps, index) {
    const groups = buildStepGroups(steps);
    const actions = groups.filter((group) => group.type === "action");
    const total = Math.max(1, actions.length);
    const active = groups.find((group) => group.startIndex <= index && index <= group.endIndex);
    if (active?.type === "action") return { current: active.actionNumber, total };
    const completed = actions.filter((group) => group.endIndex < index).length;
    return { current: Math.min(total, Math.max(1, completed || 1)), total };
  }

  return { buildStepGroups, getActionProgress };
});

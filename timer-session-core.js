(function attachTimerSessionCore(globalScope, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalScope) globalScope.HomeTrainingTimerSessionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createTimerSessionCore() {
  function nonNegativeFinite(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function activeSecondsAfterTick(previousSeconds, deltaSeconds) {
    return nonNegativeFinite(previousSeconds) + nonNegativeFinite(deltaSeconds);
  }

  function elapsedSecondsBetween(startedAt, endedAt) {
    const start = Date.parse(startedAt || "");
    const end = Date.parse(endedAt || "");
    if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
    return Math.max(0, Math.round((end - start) / 1000));
  }

  function finalizeTiming(session, activeSeconds, endedAt) {
    const elapsedSeconds = elapsedSecondsBetween(session?.startedAt, endedAt);
    const actualSeconds = Math.min(
      elapsedSeconds,
      Math.max(0, Math.round(nonNegativeFinite(activeSeconds)))
    );
    return {
      actualSeconds,
      elapsedSeconds,
      pausedSeconds: Math.max(0, elapsedSeconds - actualSeconds)
    };
  }

  return {
    activeSecondsAfterTick,
    elapsedSecondsBetween,
    finalizeTiming
  };
});

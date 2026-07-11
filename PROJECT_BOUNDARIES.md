# home-training-timer Project Boundaries

Updated: 2026-07-11

## Role

`home-training-timer` is the execution engine for 身刻 routines. It remains an independent repository and deployment.

It owns:

- routine selection and preview;
- runtime step expansion;
- timing state, pause/resume/stop;
- voice prompts, sound cues, and wake lock;
- local routine cache for offline execution;
- creation and upload of `timer_sessions`.

It does not own:

- plans or daily calendar snapshots;
- plan adjustments;
- formal `training_logs`;
- body metrics, trends, or feedback summaries;
- sync conflict decisions for 身刻-owned entities.

## Shared Contract

Canonical contracts live in the 身刻 repository. This repository keeps an identical, versioned test mirror at `contracts/v1/` so its offline test suite can verify compatibility:

- `docs/data-contract.md`
- `docs/development-constraints.md`
- `docs/next-stage-development-plan.md`

Timer changes that add or change shared fields must update the canonical contract first.

## Mandatory Rules

- Read `routine_templates` from the shared database and cache the last valid set locally. A routine is shown in the standalone selector by default; only explicit `timerVisible: false` or `needsTimer: false` hides it.
- Built-in routines are fallback/debug only and must show an explicit warning when used.
- Do not silently fall back when a requested cloud `routineId` is unavailable.
- Preserve unknown compatible fields when caching and serializing routine templates. In particular, `description`, `keyPoints`, `cues`, `warnings`, `safetyNotes`, `breath`, and `execution` must survive normalization so the pre-start guidance and runtime cues remain useful.
- Write only `timer_sessions` to the shared database.
- Never write `training_logs` or modify plans.
- `actualSeconds` represents active execution time and excludes pauses.
- Completion, stop, reset, and interrupted exit need explicit session semantics.
- Session upload must be idempotent.
- Cloud-controlled text must be rendered as text, not untrusted HTML.
- Tokens must not enter source code, documentation, URLs, logs, or Git.
- `calendarVisible: false` and `countsTowardTraining: false` must be preserved in session context for non-calendar routines.

## Runtime Model

`routine_templates.steps[].execution` may expand one user-facing action into preparation, left side, switch, and right side runtime steps.

The UI must:

- count the original action as one action;
- calculate planned duration from expanded runtime steps;
- speak expanded runtime labels;
- allow action guidance to be inspected before starting;
- keep selection/preview state separate from active execution state.

## Next Priorities

1. Add deterministic tests for execution expansion and timer state transitions.
2. Correct active/wall/paused duration fields.
3. Persist stopped/interrupted sessions reliably.
4. Remove unsafe dynamic `innerHTML` paths.
5. Split catalog, engine, session, adapters, and UI from the current single file.
6. Add CI and contract fixtures shared with 身刻.

## Definition of Done

A timer change is complete only when behavior, compatibility, tests, documentation, offline behavior, and cloud idempotency have all been verified and the repository has been pushed.

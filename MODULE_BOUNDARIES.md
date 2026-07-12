# Timer Module Boundaries

Updated: 2026-07-13

`index.html` remains the presentation shell. It owns DOM rendering, event wiring,
audio, wake lock, and catalogue presentation.

Pure modules:

- `timer-execution-core.js`: expands one template action into runtime preparation,
  side, and switch steps.
- `timer-preview-core.js`: groups those runtime steps back into one user-facing
  action for the queue and calculates action progress.
- `timer-session-core.js`: computes active, elapsed, paused, and interrupted-session
  timing facts.

The catalogue path must preserve `routine_templates` fields, especially `scene`,
`execution`, lifecycle, visibility, and guidance fields. It must not infer or mutate
template metadata during normal loading. Changes that delete, replace, migrate, or
classify cloud routines require an explicitly approved data-change task.

All modules are browser-agnostic and tested with Node. The page retains the current
static deployment URL and offline service-worker behavior.

---
"hr-skills": patch
---

Fixed `dist/hr-skills.zip` and `dist/hr-skills.skill` being written as structurally invalid archives. `buildZipBuffer` declared its running byte position as `const currentOffset = 0`, so every central-directory entry and the end-of-central-directory record recorded offset `0`. Readers still listed the entries (they self-heal the central-directory offset), but extracting anything past the first file failed with "Bad magic number for file header" — and `build-skills` reported `OK (zip)` regardless. Both archives now round-trip all 823+ entries.

Added `--help` / `-h` to every CLI, handled in `runCli` before any work runs. `--help` previously fell through as a positional argument: `bun run evaluate --help` ran the entire evaluation suite, `bun run plan --help` and `bun run execute --help` built the registry and generated a plan for the literal intent `"--help"`, and `bun run recommend --help` built all 146 skills before failing with `Unknown skill ID: "--help"`. Help now exits 0 without doing any work.

Fixed errors thrown while a spinner was running being erased from the terminal. A live `@clack/prompts` spinner repaints by erasing the lines beneath it and its exit handler stamps "Canceled" over the area, so the real message never appeared — a missing `registry/skills.json` reported only "Canceled". CLI spinners are now created through `cliSpinner()`, which lets `runCli` stop the spinner with the actual error.

Fixed `bun run evaluate --update-golden` exiting 0 even when cases failed, which silently baselined those failures into the golden fixtures. It now exits 1 and reports the failing count. Unknown flags are rejected instead of ignored, so a typo'd `--update-goldens` no longer performs a plain reporting pass.

Fixed `bun run recommend <skill> --limit 0` (and a non-numeric `--limit`) reporting "No recommendations available" — blaming the skill for a bad flag. `--limit` is now validated as a positive integer, and a flag in the positional slot prints usage instead of spending a full registry build to report `Unknown skill ID: "--limit"`.

Improved `bun run validate` output: it now shows progress for the two slowest phases instead of running silently, reports each failing skill once with its message rather than twice (the first time as a bare name), sorts issues so repeat runs over an unchanged tree emit identical logs, uses an error glyph rather than a warning for the fatal "no skills found" case, and closes the output box on failure paths instead of leaving it unterminated.

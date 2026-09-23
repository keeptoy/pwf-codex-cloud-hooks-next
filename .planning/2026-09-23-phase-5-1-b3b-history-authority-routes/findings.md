# Findings: R28 history authority routes

## Baseline

- Clean `0.5.0-dev` after B3a commit `1081e30`; active B3a plan marks index admission complete.
- History index introduces the Product Phase Overview index as long-term owner and its collection-boundary section links the ROADMAP overview-rotation rule.
- History template's `Current authority link lifecycle` gives the `phase-N-overview.md#product-phase-N-overview` target pattern and links ROADMAP rotation; the Guide's history-role section links the same ROADMAP rule.
- Existing R28 assertions still pin long strings in these three places, so equivalent explanation changes fail even when the owner links remain correct.
- Existing generic Markdown-fragment and Product overview tests provide additional coverage; this gate should not duplicate R30 per-record classification.

## Decision and residual

- A scoped helper now checks the history index introduction, index collection boundary, template lifecycle section and Guide history-role section against the Product overview index/Phase target pattern and ROADMAP rotation anchor. It also confirms the target anchors exist.
- The long owner-prose regexes were removed. Short assertions preserving the curated-history, current-programme and nonduplicated-state-machine boundaries remain until broader structural governance can replace them.
- In-memory wrong-owner probes fail; equivalent explanation rewrites in all three documents pass. R30 per-record structure and R04/R29/R31 retirement remain separate.

## Diagnostic note

- An exploratory Windows `rg` call using `docs/history/phase-*.md` failed with OS error 123 because the shell passed the wildcard path literally. Use `rg -g 'phase-*.md' docs/history` if needed.

# Findings: R17 acceptance role projections

## Baseline

- Clean branch `0.5.0-dev` after R13 local commit `88e35cf`; B2 A04/A07/R13 are complete locally.
- Inventory labels R17 `REPLACE`: acceptance index and templates repeat wording about role window, Discovery Round counts, guide freeze and C0/C1/C2. ROADMAP owns programme, templates own their execution/write protocol.
- The mixed `documentation lifecycle paths` case also contains R15 inventory/path checks, R16 exact anchors/status tokens, R18–R20 operator safety and machine checks. Those must not be swept into a broad replacement.
- Acceptance index `#acceptance-role-window` is a discovery route, not current role authority; it links ROADMAP for programme and the governance guide for immutable-ref retirement.
- Cloud template `#acceptance-document-responsibilities` has a five-row owner table and ROADMAP links. `#version-discovery-round-routing` owns guide naming/count projection. `#release-channel-checkpoint-routing` owns evidence writeback and channel status, while the Operator Guide template owns its lifecycle and Release projections.

## Questions to resolve

- Acceptance index wording became link and role-window relations: programme route to ROADMAP, retirement route to the Guide, candidate+accepted window, accepted/old guide retention and immutable-ref exit. Harmful wrong route or premature eviction fails; equivalent prose passes.
- Cloud template responsibility rows are parsed by owner rather than matched as whole sentences. Its Discovery routing section checks Round-as-count-unit and single/multi guide paths. The evidence-writeback section checks distinct Source/Candidate and Published evidence fields; Operator Guide lifecycle keeps retry/recovery state in active planning and final-only evidence in the guide.
- In-memory harmful probes cover wrong programme owner, premature index eviction, wrong Cloud protocol owner, gate-counting, guide-per-gate, missing Source evidence and retry state moved into the guide. Equivalent rewrites of index, Cloud and Operator explanations pass scoped helpers.
- R16 exact anchors and status tokens remain. Source/Candidate bootstrap/ZIP versus Published public URL/SHA, C0 tag target, C1/C2 identity and two Cloud channel independence remain under their original safety assertions because they overlap A08/R18–R20 or still need a complete cross-owner proof. `多 gate 版本` exclusion and dev/stable identity checks are likewise retained. R17's replaceable prose portion is complete, not a claim that all natural-language protocol assertions have been retired.
- Two initial focused failures were test-design assumptions: accepted guide prose uses `已经冻结` and `可以` before `current`; the Operator Guide link lives in the Cloud template introduction, not inside its responsibility section. Both were corrected without changing owner documents.
- The owner table parser reads all data rows, then requires exactly the five known owner roles; unknown or duplicate rows cannot hide outside the selected-role filter.

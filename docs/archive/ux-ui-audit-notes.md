# UX/UI audit baseline — Phase 7

## Browser observations

The desktop homepage has a clear hero and primary CTA, but the header exposes nine top-level links in one horizontal row. The page is visually calm and readable, yet the hero does not tell visitors what to do beyond browsing, and the lower featured grid is dense for first-time users. Browser annotations are automation overlays and are not part of the product UI.

The catalog has a solid search/filter foundation and a visible result count. However, the top navigation consumes a large portion of the header, the filter panel uses a generic fieldset treatment, and every card exposes long descriptions at once. This creates a high information-density first viewport and makes scanning harder. The current UI lacks explicit result sorting, active-filter chips, a visible “search syntax”/scope hint, and a compact card/list preference. Empty-state recovery exists but should be visually stronger and more explanatory.

## Initial backlog

P0: keep search, filter, URL-state, keyboard focus, and mobile access reliable while redesigning; add explicit accessible names/status updates and verify all routes at narrow widths.

P1: reduce navigation density with an Information Architecture grouping or responsive menu; improve catalog scanability with active filter summary, result sorting, shorter card preview, and clearer primary/secondary actions; add consistent page intro and breadcrumbs for product surfaces.

P1: make planner, graph, runtime, evaluation, and changelog pages share a coherent shell, status language, empty/loading/error states, and responsive interaction patterns.

P2: add progressive disclosure for long skill descriptions, contextual help for filters, and a preference for compact versus detailed catalog cards.

## Acceptance criteria

The redesign must preserve canonical package-backed data, URL state persistence, static skill pages, keyboard navigation, visible focus, no horizontal overflow at desktop/tablet/mobile widths, and deterministic Playwright coverage. Any new interactive control must have a semantic accessible name and a user-visible state change.

## Additional observations

The planner is technically functional but visually under-designed: the page has substantial unused vertical space, the textarea and button are the only meaningful interaction, and the generated result is not visible until an action is taken. There is no example prompt gallery, capability explanation, clear success/error state, loading state, or “what happens next” guidance. This makes the surface feel like an internal playground rather than a confident HR product tool.

The graph route is currently a dense card list rather than a graph visualization. It exposes 146 nodes and 779 relationships, but shows only the top 24 cards and repeats low-level skill IDs in link chips. There is no domain filter, relationship legend, selected-node focus, search, or way to understand why a relationship exists. The first viewport is visually repetitive and not task-oriented. A better experience should begin with search/domain selection, explain relationship kinds, focus one selected skill, and progressively reveal connected skills.

## Design direction

Use a calmer product shell with a compact responsive navigation, consistent page intro, a two-level information hierarchy, contextual primary actions, and progressive disclosure. Treat the catalog as the primary discovery surface, planner as the primary creation surface, and graph/runtime/evaluation/changelog as supporting exploration surfaces. Keep real canonical data and preserve URL state while adding active filter chips, clearer status messaging, example intents, selected-node graph focus, and explicit loading/empty/error feedback.

## Redesign verification

The redesigned homepage now has a clearer primary promise, two explicit starting paths, compact navigation with an Explore disclosure, visible repository-backed stats, and more purposeful section copy. The first viewport has stronger task orientation and fewer competing nav links.

The redesigned filtered catalog now exposes a plain-language search prompt, search scope help, three-way refinement (practice area, maturity, sort), an active-filter summary with removable chips, and result context that combines count, practice area and query. This is materially more scannable than the previous generic fieldset.

The browser still shows automation annotation boxes and the Next devtools indicator; these are tooling overlays, not product defects. The next verification step must test the actual user interactions behind the new chips, sort URL state, native Explore disclosure, keyboard focus, and narrow viewport overflow.

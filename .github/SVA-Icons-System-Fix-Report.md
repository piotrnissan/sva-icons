# SVA Icons System – Fix Report (for Upstream Team)

Last updated: 2025-08-20
Owner: Icons Platform Team (Upstream)  
Prepared by: SVA Framework Team

## Summary

We’ve identified discrepancies between source SVG assets and the generated ESM icon modules shipped by the SVA Icons package. These discrepancies cause visual regressions when the icons are consumed by the SVA Framework (which uses the class-based/ESM auto-register runtime). The framework copies and uses the package outputs as-is; it doesn’t transform icon shapes during copy.

Primary issue found: the "book-service" icon’s ESM module renders only a single <path>, while the source SVG contains three <path> elements. This indicates a generation/packaging issue in the SVA Icons system.

Additionally, we provide recommendations about stroke handling and fill/clip rules to ensure consistent cross-consumer rendering.

## Scope of review

- Package version in use: `sva-icons@^3.1.1`
- Files compared:
  - Source (package): `node_modules/sva-icons/svg/book-service.svg`
  - Generated (installed vendor copy): `apps/sva-core/global/output/web/vendor/sva-icons/icons/esm/book-service.js`
- Framework environment:
  - SVA Lazy Loader + SVA Icons wrapper (auto-register + alias normalization)
  - Consumers use `<i class="sva-icon" data-sva-icon="...">` (inline SVG injection)

## Findings

1) book-service: ESM module is missing paths
- Source SVG (book-service.svg) contains three <path> elements.
- Generated ESM module (book-service.js) includes only the first path.
- The framework does not remove paths; it consumes the module output. Therefore the loss occurs upstream in the SVA Icons build/generator.

2) Fill/stroke attribute consistency
- The generated modules set `fill` and `stroke` to `currentColor` and `stroke-width` to 0 by default. If any icon is stroke-based or mixed, it must set its own attributes appropriately in the generated output or rely on path-level attributes to avoid losing visual detail.
- Ensure the generator preserves path-level attributes such as fill, stroke, stroke-width, fill-rule, clip-rule, opacity, etc.

3) Fill-rule / clip-rule
- Some icons require `fill-rule="evenodd"` and `clip-rule="evenodd"` to render holes/overlaps correctly.
- Confirm the generator includes these attributes whenever present in the source SVG.

4) ViewBox and outer attributes
- The generator currently outputs `viewBox="0 0 24 24"` consistently. That matches the source for most icons. Please confirm that any non-24 grid assets are preserved with their correct viewBox.

5) Aliases vs. modules
- The wrapper normalizes legacy aliases (e.g., `message` -> `contact-fbmessage`). This is working as designed.
- No action required, but keep alias coverage current with package naming.

## Root cause hypothesis (book-service)

- The SVG-to-ESM transformation likely drops subsequent sibling path nodes, preserving only the first. This could be due to:
  - A generator step that reads only the first child path.
  - An optimization/minification step that merges/removes shapes incorrectly.
  - A template that injects only one `d` attribute, ignoring multiple paths.

## Required fixes (Upstream)

- Fix the ESM generator so it preserves all <path> (and other shape) elements found in the source SVG. The resulting ESM should concatenate all path elements within a single `<svg>…</svg>` template.
- Ensure path-level attributes are retained verbatim (fill, stroke, stroke-width, fill-rule, clip-rule, opacity, transform, etc.).
- Add tests:
  - Snapshot test: parse the source SVG tree and ensure the same number of shape nodes and attributes exist in the generated ESM output.
  - Visual diff test (optional): run a headless renderer to compare source SVG vs generated ESM SVG output for a few representative icons (including book-service).
- Publish a patch version (e.g., 3.1.x) with corrected modules.

## Optional improvements

- If the runtime must set default `fill`/`stroke`/`stroke-width`, do it only when the source had no explicit attributes, to avoid overriding icons that rely on strokes.
- Include a generator option to preserve all original attributes and omit defaults unless necessary.

## Verification checklist (post-fix)

- [ ] Open `dist/icons/esm/book-service.js` in the published package and confirm it contains three <path> elements matching the source.
- [ ] Confirm any fill-rule/clip-rule attributes from the source are present in the generated output (for icons that require them).
- [ ] Render the updated icon inside a minimal page and compare with the raw source SVG rendering.
- [ ] Run the SVA Framework `.tests/icons/all-icons.html` page to visually verify no regressions.

## Downstream (Framework) follow-up

Once the package fix is published:
- Bump `sva-icons` in `package.json` and reinstall.
- Rebuild icons and manifest via our existing tasks.
- Optional: Adjust framework CSS to avoid forcing `stroke-width: 0` globally on `.sva-icon > svg`; scope it behind a modifier if needed so stroke-based icons render correctly without overrides.

## Appendix: Concrete example

- Source: book-service.svg (excerpt)
  - Three paths present, including the main book/hand shapes and additional detail paths.
- Generated: book-service.js (current)
  - Only the first path is rendered inside the template string.

This gap is the primary cause of the visual discrepancy and must be addressed in the SVA Icons generator to ensure fidelity between source SVGs and distributed ESM modules.

# SVA Icons – Remediation Plan for ESM Generation Fidelity (v3.1.x)

Last updated: 2025-08-20
Authors: SVA Icons Maintainers
Status: Draft for Review
Target release: 3.1.x (patch)

## 1) Executive summary

SVA Framework reports a fidelity loss in generated ESM icon modules: at least `book-service` renders only one <path> while the source SVG has three. Root cause likely sits in our ESM generator/template or an optimization step that collapses or drops siblings. We will fix the generator to preserve all shape nodes and attributes, add integrity tests, and publish a patch release.

Success criteria:
- Generated `dist/icons/esm/*.js` preserve all shape nodes and critical attributes from `/svg/*.svg`.
- Parity tests pass for shape count and required attributes (fill, stroke, stroke-width, fill-rule, clip-rule, opacity, transform, viewBox).
- Visual smoke tests show no regressions.

## 2) Problem statement and scope

Observed defects (from Upstream report):
- Missing sibling paths in ESM output for `book-service`.
- Risk of attribute loss or overrides (fill-rule/clip-rule, stroke settings, transforms, opacity).
- Need to confirm `viewBox` pass-through for non-24 grids.

Scope:
- Function-based icon ESM/CJS generation and templates.
- SVGO configuration that runs before generation.
- Class-based, React, and Web Component outputs are in scope only insofar as they may reuse the same processed SVG content.

Out of scope (for this patch):
- Redesigning APIs or changing default stroke policy (remains strokeWidth: 0 by default unless overridden by source attributes).

## 3) Current-state hypotheses

Likely causes:
- Generator reads only the first child `path` when templating the SVG function output (single `d` binding), ignoring additional siblings.
- SVGO plugin configuration merges or removes paths unexpectedly (e.g., `convertShapeToPath`, `mergePaths`, or aggressive cleanup of fills/strokes).
- Templating step applies defaults that override source path-level attributes.

Where to look:
- `scripts/build-icons.js` and/or `scripts/build-function-icons.js` (function-based ESM builder and template).
- `svgo.config.json` for plugins that could alter structure/attributes.
- Any shared SVG parsing utilities used across build scripts.

## 4) Investigation plan (no code changes)

1. Reproduce locally
   - Inspect `/svg/book-service.svg` and current `dist/icons/esm/book-service.js` after a fresh build.
   - Confirm sibling count mismatch and note any missing attributes.
2. Trace the pipeline
   - Identify which build script produces `dist/icons/esm/*.js` and which template is used.
   - Log or snapshot the intermediate SVG string passed into the template (pre- and post-SVGO) for `book-service`.
3. SVGO audit
   - Review `svgo.config.json`. Temporarily disable `mergePaths` or similar to see if siblings reappear.
   - Confirm `removeUnknownsAndDefaults`, `cleanupAttrs`, and `convertPathData` aren’t stripping needed attributes.
4. Wider sample check
   - Pick 10 multi-path icons (with fill-rule/clip-rule, transforms, or opacity) and confirm parity in generated ESM.
5. ViewBox verification
   - Identify any non-24 viewBox sources and verify generated output preserves `viewBox`.

Artifacts to capture:
- Before/after SVG strings for problematic icons.
- List of SVGO plugins confirmed safe vs. adjusted.

## 5) Fix design

Design goals:
- Preserve entire inner SVG tree (all children and their attributes) inside the generated ESM wrapper.
- Apply package-level defaults only when the source does not specify them.
- Avoid structural rewrites in the generator; rely on source fidelity.

Approach A (preferred): Raw inner SVG preservation
- Parse only enough to extract `<svg>` outer attributes and inner content string.
- In ESM template, inject the full inner content string verbatim.
- Normalize only outer `<svg>` attributes we own (e.g., `xmlns`, `viewBox`), but do not add default stroke/fill on `<svg>` if the source paths already declare them.
- Continue setting friendly defaults via function props, but skip if source path-level attributes exist (do not override).

Approach B (alternate): AST recompose
- Parse SVG with a robust XML parser (e.g., fast-xml-parser) and reconstruct children programmatically.
- More control but higher complexity; reserved for future major versions if needed.

SVGO adjustments (minimal):
- Disable or tune any plugin that merges or drops sibling shapes (`mergePaths`, overly aggressive `convertShapeToPath`).
- Ensure `removeUnknownsAndDefaults` does not strip `fill-rule`, `clip-rule`, or `stroke-width` when present.
- Preserve `transform`, `opacity`, `clipPath`, `mask`, and `defs` content.

Defaults policy (enforced single-color, no-stroke):
- All icons are single-color/themeable: every visible path must inherit `currentColor`.
- No strokes allowed: generator outputs `stroke="none"` on `<svg>` and removes any stroke props from inner nodes.
- Path-level `fill` is removed unless it is `fill="none"` (to keep cutouts). This ensures theming via `currentColor`.
- v3.1+ default remains `strokeWidth: 0`; stroke-related props are ignored/removed in output.

## 6) Implementation steps (proposed)

1. Generator template updates
   - Update the function-based ESM/CJS template to:
     - Inject full inner SVG content instead of a single `d`/path.
     - Apply color/size via outer `<svg>` style/attributes without overriding path-level attributes.
     - Preserve `viewBox` from source. Do not hardcode `0 0 24 24` if source differs.
2. SVGO config hardening
  - Adjust `svgo.config.json` to preserve sibling paths and critical attributes. Document rationale inline.
  - Ensure removal of `fill`/`stroke`/`style` at source level remains aligned with single-color/no-stroke policy while preserving `fill-rule`/`clip-rule`/`transform`/`opacity`.
3. Attribute pass-through
  - Generator injects full inner SVG content and strips per-path `fill` unless `none`; strips any `stroke` props. Outer `<svg>` sets `fill=currentColor`, `stroke=none`.
  - Preserve `fill-rule`/`clip-rule`/`transform`/`opacity`/`viewBox` as-is.
4. Build all outputs
   - Regenerate ESM/CJS, React, Web Components to keep consistency. Verify they render identical SVG trees.
5. Documentation updates
   - Add a short note in `USAGE.md` clarifying attribute precedence: source attributes win over defaults.

## 7) Testing strategy

Automated integrity tests (Node):
- Shape parity test
  - For each `/svg/*.svg`, parse and count shape nodes: `path`, `circle`, `rect`, `polyline`, `polygon`, `line`, `ellipse`, plus containers `g`, `mask`, `clipPath` for structure verification.
  - Render generated `dist/icons/esm/*.js` to an SVG string (by calling the function with default props) and re-count. Counts must match for shapes; key attributes must be present when in source.
- Attribute parity test
  - Verify preservation of `fill-rule`, `clip-rule`, `transform`, `opacity` when present in source.
  - Verify no `stroke` attributes exist in output; verify no path-level `fill` values other than `none` (outer `svg` sets `fill=currentColor`).
- ViewBox test
  - Compare `<svg viewBox>` between source and output.

Manual and visual tests:
- Add a minimal `.tests/generation-integrity.html` that injects both the raw source and generated SVG side-by-side for a selected set (including `book-service`) using the dev server (`node scripts/dev-server.mjs`).
- Optional: Puppeteer-based pixel diff for 3–5 representative icons to catch subtle differences.

Note: Place browser-based tests under `.tests/` per project convention, and use the dev server for viewing.

## 8) Acceptance criteria

- `book-service` generated ESM contains three paths matching the source with all necessary attributes.
- Shape and attribute parity tests pass for all icons.
- No regressions in `.tests/` visual pages.
- `viewBox` preserved for any non-24 assets (if any).
- React and Web Component outputs also preserve multi-path icons.

## 9) Rollout plan

- Branch: `fix/esn-generator-multi-path-parity`
- Commit phases:
  1) Add integrity tests and run against current state (expect failures).
  2) Update generator template and SVGO config; iterate until tests pass.
  3) Rebuild; update docs; final verification via dev server and optional visual diff.
- Versioning: bump patch `3.1.x`.
- Publish: `npm publish`.
- Post-publish: confirm visual testing auto-deploy completes; sanity-check CDN (`unpkg`) and demo.

## 10) Risks and mitigations

- Risk: Stripping path-level `fill` values could change appearance if any icon relied on a non-currentColor fill.
  - Mitigation: Policy is single-color for all icons; this is intended. Keep `fill="none"` intact for cutouts.
- Risk: SVGO config changes increase bundle size slightly.
  - Mitigation: Targeted plugin tuning; measure delta; keep changes minimal.
- Risk: Edge-case SVGs (masks/defs) differ after templating.
  - Mitigation: Include such icons in the parity sample set and tests.

## 11) Edge cases to verify

- Icons with multiple `path` siblings (e.g., `book-service`).
- Icons using `fill-rule`/`clip-rule` for holes/overlaps.
- Icons with `transform` on groups or paths.
- Icons with opacity/alpha on sub-shapes.
- Icons with `mask`/`clipPath`/`defs` and nested groups.
- Non-24 viewBox (if present) and dimensionless SVGs.
- Icons that previously had hard-coded fills (ensure new output correctly inherits `currentColor`).

## 12) Verification checklist (post-fix)

- [ ] `dist/icons/esm/book-service.js` shows three <path> elements; attributes preserved.
- [ ] Attribute parity: `fill-rule`/`clip-rule`/`stroke`/`stroke-width`/`transform`/`opacity` retained when present.
- [ ] `viewBox` preserved from source.
- [ ] `.tests/` visual pages match raw SVG appearance.
- [ ] Optional: Pixel diffs within tolerance for sample set.

## 13) Appendix

Illustrative ESM wrapper shape (conceptual):

```js
// Example: function-based ESM template idea (simplified)
export function BookService(props = {}) {
  const { size = 24, color = 'currentColor', className, style } = props;
  // Outer attributes only; innerContent comes verbatim from source (after SVGO)
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"  /* use source viewBox */
      width="${size}"
      height="${size}"
      fill="${color}"
      class="${className ?? ''}"
      style="${style ?? ''}"
    >
      ${innerContent /* contains all child paths/groups with original attributes */}
    </svg>
  `;
}
```

Note: Defaults (e.g., `fill`, `strokeWidth`) must not overwrite explicit attributes on inner nodes; set them only when the source nodes omit them.

---

Please review. On approval, we’ll proceed with implementing tests first, then the generator fix, and close with a patch release.

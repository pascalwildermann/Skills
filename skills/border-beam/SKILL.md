---
name: border-beam
description: Wraps a UI element in a traveling border beam, a bright arc that rides the element outline. Use when adding a border beam, animated outline, edge glow, or a libraries.dev-style beam around a card, button, input, or other element, and when tuning its color, gradient, speed, thickness, glow, arc length, direction, pause state, or single-edge travel. Don't use for press or bounce feedback, hover-only color changes, page or route transitions, loading skeletons, pulse or breathing halos, liquid or gooey morphs, or for painting the beam onto the element without the shared wrapper.
---

# Border beam

Wrap the element the user named in `app-ao-border-beam`. The beam is a bright arc that travels the outline. One color fades out along the arc. Two or more colors form a gradient along that same arc. Keep the effect on the wrapper. Do not paint it onto the element's own border, and do not install the `border-beam` npm package.

## Procedures

**Step 1: Confirm scope**
1. Apply the effect only when the user asked for a border beam, an animated outline, an edge glow, or a traveling light around an element.
2. If the user did not name the element, stop and ask which element should receive the beam.
3. Change only the named elements. Leave every other element unchanged.
4. Project one element into each wrapper. If the template would project more than one root node, stop and ask which node to wrap.
5. Do not nest a beam inside another beam.

**Step 2: Ensure the wrapper exists**
1. If `libs/design-system/src/lib/components/elements/ao-border-beam/ao-border-beam.component.ts` already exists, keep it. Read its inputs and use those. Do not overwrite the component, the stylesheet, the spec, or the story from the assets.
2. If that file does not exist, copy the assets to these destinations without renaming selectors, inputs, custom properties, or keyframes:
   - `assets/ao-border-beam.component.ts` → `libs/design-system/src/lib/components/elements/ao-border-beam/ao-border-beam.component.ts`
   - `assets/border-beam.scss` → `libs/design-system/src/lib/components/elements/ao-border-beam/ao-border-beam.component.scss`
   - `assets/ao-border-beam.component.spec.ts` → `libs/design-system/src/lib/components/elements/ao-border-beam/ao-border-beam.component.spec.ts`
   - `assets/ao-border-beam.stories.ts` → `libs/design-system/src/lib/components/elements/ao-border-beam/stories/ao-border-beam.stories.ts`
3. Add `AoBorderBeamComponent` to the `imports` array and the `exports` array of `DesignSystemModule` in `libs/design-system/src/lib/design-system.module.ts`. Do not add it to `declarations`.
4. Follow `.agents/skills/design-system-update/SKILL.md`. Document `app-ao-border-beam` in `references/feedback.md`.
5. Run `npx jest -c libs/design-system/jest.config.ts ao-border-beam`. The spec must pass before the wrapper is used. `npx nx test design-system --testPathPattern=...` ignores the pattern and runs the whole library.

**Step 3: Wrap the named element**
1. Read the template that contains the element.
2. Put the wrapper around that element only:

```html
<app-ao-border-beam>
  <button ao-button>Save</button>
</app-ao-border-beam>
```

3. Add `AoBorderBeamComponent` to the `imports` array of the standalone component that owns the template. If that component is declared in an NgModule that already imports `DesignSystemModule`, the module export is enough.
4. Move sibling spacing onto the wrapper: margin utilities and `ao-mt-*` / `ao-mb-*` / `ao-ml-*` / `ao-mr-*` that separate this element from its siblings. Leave padding, typography, and the child's own border radius on the child.
5. When the element is a block that fills its parent (`ao-w-full`, `width: 100%`, a card, or a form field), set `fill`. Keep the child's width as well, so the child still fills the wrapper.
6. Leave `:focus-visible` outlines on the child. Do not set `overflow: hidden` on the wrapper or the parent.

**Step 4: Set the controls the user named**
1. Read `references/controls.md`.
2. Set only the inputs the user named. Leave every other input at its default.
3. Pass one CSS color to `color`, or a list of two or more CSS colors for a gradient along the arc. Do not pass a `linear-gradient(...)` or `conic-gradient(...)` string as `color`.
4. Express speed as `duration`, the time for one lap. The default is `4s`. Use about `2s` when the user asks for a faster beam and about `8s` for a slower beam. Do not go below `0.8s` unless the user gives a time. Do not use the motion duration tokens; those are 100–350ms.
5. A unitless number is seconds for `duration` and `delay`, pixels for `width` and `glow`, degrees for `spread`, and a percent for `length`. A string that already has a unit is used as written.

**Step 5: Verify**
1. After creating or changing the component, the spec from Step 2.5 must pass.
   Open `/preview-features/border-beam` in dev to tune the values. The playground's code panel prints the snippet to paste.
2. When a screen was wrapped, open that screen. Confirm the arc travels the outline, the corners match the element, and a click or keypress still activates the element.
3. When the component was only created, open the Border Beam story and confirm the arc travels the button outline.

## Error Handling

* If the component file exists but an input from `references/controls.md` is missing, stop and report the missing input. Do not patch the component from the asset unless the user asked to change the beam itself.
* If `npx nx test design-system --testPathPattern=ao-border-beam.component.spec.ts` fails because `afterNextRender` has not applied the measured radius, call `await fixture.whenStable()` and `fixture.detectChanges()` again. Do not delete the radius assertion.
* If the arc never travels and stays a static dash, `@property --beam-angle` was dropped from the component stylesheet. Move only that `@property` rule to `libs/shared/storybook-host/scss/base/_root.scss`. Leave the rest of the stylesheet on the component.
* If a parent has `overflow: hidden`, the glow outside the edge is clipped. Keep the recipe and report the clipping. Do not remove the parent's overflow.
* If the measured radius stays `0px` while the element is visibly rounded, the element was hidden on first render. Set `radius` to the element's radius.
* The single-edge beam is a straight bar on that side. It does not follow the corner curve. The full orbit does. Say which one was applied.
* If the child already uses `::before` or `::after`, leave those pseudos alone. The beam layers belong to the wrapper.

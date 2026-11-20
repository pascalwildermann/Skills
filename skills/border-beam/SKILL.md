---
name: border-beam
description: "Wraps a UI element in a traveling border beam, a bright arc that rides the element outline. Use when adding a border beam, animated outline, edge glow, or a libraries.dev-style beam around a card, button, input, or other element in Angular or another UI stack, and when tuning its color, gradient, speed, thickness, glow, arc length, direction, pause state, or single-edge travel. Don't use for press or bounce feedback, hover-only color changes, page or route transitions, loading skeletons, pulse or breathing halos, liquid or gooey morphs, or for painting the beam onto the element without a wrapper."
---

# Border beam

Wrap the element the user named. The beam is a bright arc that travels the outline. One color fades out along the arc. Two or more colors form a gradient along that same arc. Keep the effect on the wrapper. Do not paint it onto the element's own border, and do not install the `border-beam` npm package.

## Procedure

1. Confirm the element, the color or colors, and any other values the user named. Read [references/controls.md](references/controls.md) for the full set and the defaults. Leave every unnamed value at its default.

2. Search the project for an existing border-beam component or stylesheet (`border-beam`, `BorderBeam`, `app-border-beam`, or a prefixed selector such as `app-ao-border-beam`). When one exists, use its inputs and its selector. Do not overwrite that component, stylesheet, spec, or story from these assets.

3. Choose the install path from the stack.

   **Angular.** Copy the component into the folder where this project keeps shared UI components. Match the naming of the files already in that folder.

   - `assets/border-beam.component.ts`
   - `assets/border-beam.component.scss`
   - `assets/border-beam.component.spec.ts`, only when the project already runs component tests
   - `assets/border-beam.stories.ts`, only when that folder already has stories. Set the story title prefix to match a neighboring story.

   The asset selector is `app-border-beam`. When the project configures a component prefix, rename the selector in the component, the spec, and the story to `{prefix}-border-beam`. Leave the `border-beam` class names as they are.

   Import the component into the parent that wraps the element. Standalone parents import it directly. An NgModule parent adds it to `imports` and, when the module re-exports shared UI, to `exports`. Do not add it to `declarations`.

   Run the project's component test command for this spec before using the wrapper. Discover that command from the project (Jest config, `package.json`, or the workspace task runner). Skip the spec when the project has no component test runner. Do not pass a path pattern through a task that ignores it and runs the whole suite.

   Document the component only when the project already has a design-system skill or a component catalog that lists wrappers. Skip that step otherwise.

   **Any other UI stack.** Do not copy the Angular component. Copy `assets/border-beam.css` next to the feature styles, or into the global stylesheet. Use the markup in step 4. Map each named value through the plain-wrapper table in [references/controls.md](references/controls.md).

4. Wrap the element.

   Angular, after any prefix rename:

   ```html
   <app-border-beam>
     <button type="button">Save</button>
   </app-border-beam>
   ```

   Other stacks:

   ```html
   <div
     class="border-beam"
     data-beam-edge="full"
     data-beam-fill="false"
     data-beam-active="true"
     data-beam-direction="clockwise"
     data-beam-glow="on"
     style="--beam-color: #0059ff">
     <div class="border-beam__glow" aria-hidden="true">
       <div class="border-beam__layer border-beam__layer--glow"></div>
     </div>
     <div class="border-beam__layer border-beam__layer--stroke" aria-hidden="true"></div>
     <div class="border-beam__content">
       <button type="button">Save</button>
     </div>
   </div>
   ```

5. Set only the inputs the user named. On the plain wrapper, set the matching attribute or custom property from the controls reference. When the user asks for the brand color and the project already has a brand or border token, pass that token as `color`. Otherwise leave the default `#0059ff`.

6. Keep the wrapper tight around the element.

   - One element per wrapper.
   - The wrapper sizes to the element. A block that fills its parent (a card, a form field, or an element with `width: 100%`) needs `fill` on the Angular component, or `data-beam-fill="true"` on the plain wrapper. Keep the child's width as well.
   - Move margin that separates this element from its siblings onto the wrapper. Leave padding, typography, and the child's own border radius on the child.
   - Omit `radius` unless the user names one. The Angular component copies the child's computed `border-radius` after the first render. On the plain wrapper, set `--beam-radius` to that same computed value.
   - Do not set `overflow: hidden` on the wrapper. The glow is meant to spill past the edge.

7. Verify the change. The wrapped element still receives clicks and keyboard focus. The arc travels the outline, or the named edge. A gradient follows the arc. `active` set to false holds the arc in place. `glow` set to `0` leaves a sharp stroke. `prefers-reduced-motion: reduce` leaves a static hairline in the beam color and hides the glow.

## Error handling

- A missing input is fine. The defaults in the controls reference apply.
- When the measured radius is still empty in a test, call `await fixture.whenStable()` and detect changes again. Do not delete the radius assertion.
- When a build strips `@property`, move that block into the global stylesheet listed in the project build config (`styles` in the Angular build, or the main CSS entry). Leave a comment in the component stylesheet pointing at that file. The angle then animates instead of jumping.
- A beam that looks clipped is usually `overflow: hidden` on a parent. Move the clipping to an inner element, or accept that the glow is cut off.
- A beam that is shorter than the element is usually a margin or a shrink-wrapped wrapper around a full-width child. Move the margin to the wrapper, or set `fill`.
- A radius of `0` on an element that is hidden at first render is the measurement finding no box. Pass `radius` explicitly.
- `top`, `bottom`, `start`, and `end` draw a straight bar. They do not follow the corner curve. Use `full` when the beam should follow the radius.
- Do not put the beam on the element's own `::before` or `::after`. The wrapper owns those layers.

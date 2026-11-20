# Border beam controls

Inputs of `app-ao-border-beam`. Set only the inputs named by the user. A unitless number gains the unit in the last column. A string that already has a unit is used as written.

| Input | Default | Unitless number | What it changes |
| --- | --- | --- | --- |
| `color` | `var(--color-border-brand-primary)` | — | One CSS color, or a list of two or more colors spread along the arc. The list wins over a single color. The arc still fades to transparent at both ends. |
| `duration` | `4s` | seconds | Time for one full lap, or one pass along a single edge. Lower is faster. |
| `width` | `1.5px` | pixels | Thickness of the bright stroke. |
| `radius` | measured from the projected element | pixels | Corner radius of a full-orbit beam. Omit it to copy the child's computed `border-radius` after the first render. |
| `strength` | `1` | — | Opacity of the stroke and the glow, clamped to `0`–`1`. `0` hides both. It does not remove the wrapper. |
| `glow` | `12px` | pixels | Blur of the soft bloom behind the stroke. `0` removes the bloom and leaves the stroke. |
| `spread` | `72deg` | degrees | Length of the bright arc on a full orbit. Ignored when `edge` is not `full`. |
| `length` | `40%` | percent | Length of the bright segment along one edge. Ignored when `edge` is `full`. |
| `direction` | `clockwise` | — | `clockwise` or `counter-clockwise`. On `top` and `bottom`, clockwise travels left to right. On `start` and `end`, clockwise travels top to bottom. The other value reverses that. |
| `active` | `true` | — | `false` pauses the beam in place. The stroke stays visible. |
| `edge` | `full` | — | `full` rides the whole outline. `top`, `bottom`, `start`, or `end` draws a straight bar on that side. `start` and `end` follow the inline direction. |
| `fill` | `false` | — | `false` shrink-wraps the wrapper to the element. `true` makes the wrapper `width: 100%`. |
| `delay` | `0s` | seconds | Shifts the phase. A negative delay starts the arc partway around, so two beams do not travel in step. |

`color` accepts a CSS color such as `var(--color-border-brand-primary)`, `#5b6cff`, or `rgb(91, 108, 255)`. Split a gradient the user describes into those stops. Do not pass `linear-gradient(...)` or `conic-gradient(...)` as a stop.

`edge: "full"` follows `radius`. A single edge does not follow the corner curve.

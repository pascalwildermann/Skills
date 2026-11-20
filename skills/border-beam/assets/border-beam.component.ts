import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

const DEFAULT_COLOR = '#0059ff';
const MIN_GRADIENT_STOPS = 2;

export type BorderBeamEdge = 'full' | 'top' | 'bottom' | 'start' | 'end';
export type BorderBeamDirection = 'clockwise' | 'counter-clockwise';

function cssValue(value: string | number | null | undefined, unit: string): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null;
    }
    return `${value}${unit}`;
  }

  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}${unit}`;
  }

  return trimmed;
}

@Component({
  selector: 'app-border-beam',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-beam__glow" aria-hidden="true">
      <div class="border-beam__layer border-beam__layer--glow"></div>
    </div>
    <div class="border-beam__layer border-beam__layer--stroke" aria-hidden="true"></div>
    <div #content class="border-beam__content">
      <ng-content />
    </div>
  `,
  styleUrls: ['./border-beam.component.scss'],
  host: {
    class: 'border-beam',
    '[attr.data-beam-edge]': 'edge()', // eslint-disable-line @typescript-eslint/naming-convention
    '[attr.data-beam-fill]': 'fill() ? "true" : "false"', // eslint-disable-line @typescript-eslint/naming-convention
    '[attr.data-beam-active]': 'active() ? "true" : "false"', // eslint-disable-line @typescript-eslint/naming-convention
    '[attr.data-beam-direction]': 'direction()', // eslint-disable-line @typescript-eslint/naming-convention
    '[attr.data-beam-glow]': 'glowOff() ? "off" : "on"', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-color]': 'beamColor()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-color-end]': 'beamColorEnd()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-gradient]': 'beamGradient()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-line]': 'beamLine()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-duration]': 'durationCss()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-width]': 'widthCss()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-radius]': 'radiusCss()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-strength]': 'strength()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-glow]': 'glowCss()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-spread]': 'spreadCss()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-length]': 'lengthCss()', // eslint-disable-line @typescript-eslint/naming-convention
    '[style.--beam-delay]': 'delayCss()', // eslint-disable-line @typescript-eslint/naming-convention
  },
})
export class BorderBeamComponent {
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly measuredRadius = signal<string | null>(null);

  readonly color = input<string | readonly string[]>(DEFAULT_COLOR);
  readonly duration = input<string | number>('4s');
  readonly width = input<string | number>('1.5px');
  readonly radius = input<string | number | null>(null);
  readonly strength = input(1, {
    transform: (value: unknown) => {
      const number = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(number)) {
        return 1;
      }
      return Math.min(1, Math.max(0, number));
    },
  });
  readonly glow = input<string | number>('12px');
  readonly spread = input<string | number>('72deg');
  readonly length = input<string | number>('40%');
  readonly direction = input<BorderBeamDirection>('clockwise');
  readonly active = input(true, { transform: booleanAttribute });
  readonly edge = input<BorderBeamEdge>('full');
  readonly fill = input(false, { transform: booleanAttribute });
  readonly delay = input<string | number>('0s');

  private readonly stops = computed(() => {
    const value = this.color();
    const list = (Array.isArray(value) ? value : [value]).map((stop) => stop.trim()).filter(Boolean);
    return list.length > 0 ? list : [DEFAULT_COLOR];
  });

  protected readonly beamColor = computed(() => this.stops()[0]);
  protected readonly beamColorEnd = computed(() => this.stops()[this.stops().length - 1]);
  protected readonly beamGradient = computed(() => {
    const stops = this.stops();
    if (stops.length < MIN_GRADIENT_STOPS) {
      return null;
    }

    const parts = stops
      .map((stop, index) => {
        const position = index / (stops.length - 1);
        return `${stop} calc(var(--beam-spread) * ${position})`;
      })
      .join(', ');

    return `conic-gradient(from var(--beam-angle) at 50% 50%, transparent 0deg, ${parts}, transparent calc(var(--beam-spread) + 48deg), transparent 360deg)`;
  });
  protected readonly beamLine = computed(() => {
    if (this.edge() === 'full') {
      return null;
    }

    const stops = this.stops();
    return `linear-gradient(var(--beam-line-angle), transparent, ${stops.join(', ')}, transparent)`;
  });
  protected readonly durationCss = computed(() => cssValue(this.duration(), 's'));
  protected readonly widthCss = computed(() => cssValue(this.width(), 'px'));
  protected readonly radiusCss = computed(() => cssValue(this.radius(), 'px') ?? this.measuredRadius());
  protected readonly glowCss = computed(() => cssValue(this.glow(), 'px'));
  protected readonly glowOff = computed(() => {
    const value = this.glowCss();
    return value === '0' || value === '0px' || value === '0rem' || value === '0em';
  });
  protected readonly spreadCss = computed(() => cssValue(this.spread(), 'deg'));
  protected readonly lengthCss = computed(() => cssValue(this.length(), '%'));
  protected readonly delayCss = computed(() => cssValue(this.delay(), 's'));

  constructor() {
    afterNextRender(() => {
      this.measureRadius();
    });
  }

  private measureRadius(): void {
    if (cssValue(this.radius(), 'px')) {
      return;
    }

    const child = this.content().nativeElement.firstElementChild;
    if (!(child instanceof HTMLElement)) {
      return;
    }

    const radius = getComputedStyle(child).borderRadius;
    if (!radius || radius === '0px') {
      return;
    }

    this.measuredRadius.set(radius);
  }
}

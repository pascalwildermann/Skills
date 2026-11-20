import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AoBorderBeamComponent } from './ao-border-beam.component';

@Component({
  imports: [AoBorderBeamComponent],
  template: `
    <app-ao-border-beam>
      <div style="border-radius: 12px; width: 80px; height: 40px"></div>
    </app-ao-border-beam>
  `,
})
class MeasuredRadiusHost {}

@Component({
  imports: [AoBorderBeamComponent],
  template: `
    <app-ao-border-beam radius="20px">
      <div style="border-radius: 12px; width: 40px; height: 40px"></div>
    </app-ao-border-beam>
  `,
})
class ExplicitRadiusHost {}

describe('AoBorderBeamComponent', () => {
  describe('inputs', () => {
    let fixture: ComponentFixture<AoBorderBeamComponent>;
    let hostElement: HTMLElement;

    beforeEach(async () => {
      jest.clearAllMocks();

      await TestBed.configureTestingModule({
        imports: [AoBorderBeamComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(AoBorderBeamComponent);
      hostElement = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('should use a brand-colored clockwise orbit by default', () => {
      expect(hostElement.style.getPropertyValue('--beam-color')).toBe('var(--color-border-brand-primary)');
      expect(hostElement.style.getPropertyValue('--beam-color-end')).toBe('var(--color-border-brand-primary)');
      expect(hostElement.style.getPropertyValue('--beam-gradient')).toBe('');
      expect(hostElement.getAttribute('data-beam-edge')).toBe('full');
      expect(hostElement.getAttribute('data-beam-active')).toBe('true');
      expect(hostElement.getAttribute('data-beam-direction')).toBe('clockwise');
      expect(hostElement.getAttribute('data-beam-fill')).toBe('false');
      expect(hostElement.getAttribute('data-beam-glow')).toBe('on');
    });

    it('should build a conic gradient when color has two or more stops', () => {
      fixture.componentRef.setInput('color', ['#112233', '#abcdef']);
      fixture.detectChanges();

      const gradient = hostElement.style.getPropertyValue('--beam-gradient');
      expect(gradient).toContain('conic-gradient');
      expect(gradient).toContain('#112233');
      expect(gradient).toContain('#abcdef');
      expect(hostElement.style.getPropertyValue('--beam-color')).toBe('#112233');
      expect(hostElement.style.getPropertyValue('--beam-color-end')).toBe('#abcdef');
    });

    it('should build a line gradient when an edge has three or more stops', () => {
      fixture.componentRef.setInput('edge', 'bottom');
      fixture.componentRef.setInput('color', ['#111111', '#222222', '#333333']);
      fixture.detectChanges();

      const line = hostElement.style.getPropertyValue('--beam-line');
      expect(hostElement.getAttribute('data-beam-edge')).toBe('bottom');
      expect(line).toContain('linear-gradient');
      expect(line).toContain('#111111');
      expect(line).toContain('#333333');
    });

    it('should pause the beam when active is false', () => {
      fixture.componentRef.setInput('active', false);
      fixture.detectChanges();

      expect(hostElement.getAttribute('data-beam-active')).toBe('false');
    });

    it('should reverse direction when direction is counter-clockwise', () => {
      fixture.componentRef.setInput('direction', 'counter-clockwise');
      fixture.detectChanges();

      expect(hostElement.getAttribute('data-beam-direction')).toBe('counter-clockwise');
    });

    it('should append units when duration, width, spread, length, and delay are numbers', () => {
      fixture.componentRef.setInput('duration', 2);
      fixture.componentRef.setInput('width', 3);
      fixture.componentRef.setInput('spread', 90);
      fixture.componentRef.setInput('length', 25);
      fixture.componentRef.setInput('delay', 0.5);
      fixture.detectChanges();

      expect(hostElement.style.getPropertyValue('--beam-duration')).toBe('2s');
      expect(hostElement.style.getPropertyValue('--beam-width')).toBe('3px');
      expect(hostElement.style.getPropertyValue('--beam-spread')).toBe('90deg');
      expect(hostElement.style.getPropertyValue('--beam-length')).toBe('25%');
      expect(hostElement.style.getPropertyValue('--beam-delay')).toBe('0.5s');
    });

    it('should hide the glow when glow is 0', () => {
      fixture.componentRef.setInput('glow', 0);
      fixture.detectChanges();

      expect(hostElement.getAttribute('data-beam-glow')).toBe('off');
      expect(hostElement.style.getPropertyValue('--beam-glow')).toBe('0px');
    });

    it('should clamp strength into 0 through 1', () => {
      fixture.componentRef.setInput('strength', 2);
      fixture.detectChanges();
      expect(hostElement.style.getPropertyValue('--beam-strength')).toBe('1');

      fixture.componentRef.setInput('strength', -1);
      fixture.detectChanges();
      expect(hostElement.style.getPropertyValue('--beam-strength')).toBe('0');
    });

    it('should stretch the wrapper when fill is true', () => {
      fixture.componentRef.setInput('fill', true);
      fixture.detectChanges();

      expect(hostElement.getAttribute('data-beam-fill')).toBe('true');
    });
  });

  describe('projected radius', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should copy the projected child border radius when radius is omitted', async () => {
      const beam = await renderHost(MeasuredRadiusHost);

      expect(beam.style.getPropertyValue('--beam-radius')).toBe('12px');
    });

    it('should keep an explicit radius when the child has a different one', async () => {
      const beam = await renderHost(ExplicitRadiusHost);

      expect(beam.style.getPropertyValue('--beam-radius')).toBe('20px');
    });
  });
});

async function renderHost(host: Type<unknown>): Promise<HTMLElement> {
  await TestBed.configureTestingModule({
    imports: [host],
  }).compileComponents();

  const fixture = TestBed.createComponent(host);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return fixture.nativeElement.querySelector('app-ao-border-beam') as HTMLElement;
}

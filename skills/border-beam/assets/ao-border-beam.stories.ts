import { Meta } from '@storybook/angular';
import { AoBorderBeamComponent } from '../ao-border-beam.component';

export default {
  title: 'Design-System/Elements/Border Beam',
  component: AoBorderBeamComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wraps one element in a traveling border beam. Pass one color, or a list of colors for a gradient along the arc.',
      },
    },
  },
} as Meta;

export const Default = () => ({
  component: AoBorderBeamComponent,
  template: `
    <app-ao-border-beam>
      <button type="button" style="border: 0; border-radius: 12px; padding: 12px 20px">Continue</button>
    </app-ao-border-beam>
  `,
});

export const Gradient = () => ({
  component: AoBorderBeamComponent,
  template: `
    <app-ao-border-beam
      [color]="['var(--color-border-brand-primary)', 'var(--color-border-brand-secondary)']"
      duration="6s">
      <button type="button" style="border: 0; border-radius: 16px; padding: 24px 32px">Continue</button>
    </app-ao-border-beam>
  `,
});

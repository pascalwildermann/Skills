import { Meta } from '@storybook/angular';
import { BorderBeamComponent } from '../border-beam.component';

export default {
  title: 'Elements/Border Beam',
  component: BorderBeamComponent,
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
  component: BorderBeamComponent,
  template: `
    <app-border-beam>
      <button type="button" style="border: 0; border-radius: 12px; padding: 12px 20px">Continue</button>
    </app-border-beam>
  `,
});

export const Gradient = () => ({
  component: BorderBeamComponent,
  template: `
    <app-border-beam
      [color]="['#0059ff', '#73a4ff']"
      duration="6s">
      <button type="button" style="border: 0; border-radius: 16px; padding: 24px 32px">Continue</button>
    </app-border-beam>
  `,
});

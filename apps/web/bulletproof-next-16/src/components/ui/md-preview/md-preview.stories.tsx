import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MdPreview } from './md-preview';

const meta: Meta<typeof MdPreview> = {
  component: MdPreview,
};

export default meta;

type Story = StoryObj<typeof MdPreview>;

export const Default: Story = {
  args: {
    value: `## Hello World!`,
  },
};

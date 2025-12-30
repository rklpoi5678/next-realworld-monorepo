import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Notification } from './notification';

const meta: Meta<typeof Notification> = {
    component: Notification,    
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {
    args: {}
};
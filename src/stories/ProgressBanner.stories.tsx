import type { Meta, StoryObj } from '@storybook/react';
import ProgressBanner from '@/components/ProgressBanner';

const meta: Meta<typeof ProgressBanner> = {
  component: ProgressBanner,
  title: 'Components/ProgressBanner',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    percent: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The progress percentage',
    },
    eta: {
      control: { type: 'number' },
      description: 'Estimated time remaining in seconds',
    },
    tokensUsed: {
      control: { type: 'number' },
      description: 'Number of tokens used so far',
    },
    message: {
      control: 'text',
      description: 'Progress message to display',
    },
    onClose: { action: 'onClose' },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBanner>;

export const Default: Story = {
  args: {
    percent: 45,
    eta: 180,
    tokensUsed: 5250,
    message: 'Processing your request...',
    onClose: () => console.log('Close clicked'),
  },
};

export const Starting: Story = {
  args: {
    percent: 5,
    eta: 300,
    tokensUsed: 500,
    message: 'Starting the render process...',
    onClose: () => console.log('Close clicked'),
  },
};

export const AlmostComplete: Story = {
  args: {
    percent: 92,
    eta: 15,
    tokensUsed: 11050,
    message: 'Almost finished...',
    onClose: () => console.log('Close clicked'),
  },
};

export const Complete: Story = {
  args: {
    percent: 100,
    eta: 0,
    tokensUsed: 12500,
    message: 'Processing complete!',
    onClose: () => console.log('Close clicked'),
  },
};
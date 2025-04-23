import type { Meta, StoryObj } from '@storybook/react';
import AgentCard from '@/components/AgentCard';

const meta: Meta<typeof AgentCard> = {
  component: AgentCard,
  title: 'Components/AgentCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the agent',
    },
    status: {
      control: { type: 'select' },
      options: ['idle', 'working', 'error'],
      description: 'The current status of the agent',
    },
    lastRunAt: {
      control: 'date',
      description: 'When the agent was last run',
    },
    onRun: { action: 'onRun' },
  },
};

export default meta;
type Story = StoryObj<typeof AgentCard>;

export const Default: Story = {
  args: {
    name: 'Research Bot',
    status: 'idle',
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    onRun: () => console.log('Run clicked'),
  },
};

export const Working: Story = {
  args: {
    name: 'Character Designer',
    status: 'working',
    lastRunAt: new Date(),
    onRun: () => console.log('Run clicked'),
  },
};

export const Error: Story = {
  args: {
    name: 'Visual Renderer',
    status: 'error',
    lastRunAt: new Date(Date.now() - 1000 * 60 * 10),
    onRun: () => console.log('Run clicked'),
  },
};

export const NeverRun: Story = {
  args: {
    name: 'New Agent',
    status: 'idle',
    onRun: () => console.log('Run clicked'),
  },
};
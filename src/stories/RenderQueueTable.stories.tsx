import type { Meta, StoryObj } from '@storybook/react';
import RenderQueueTable from '@/components/RenderQueueTable';
import { RenderJob } from '@/types';

const meta: Meta<typeof RenderQueueTable> = {
  component: RenderQueueTable,
  title: 'Components/RenderQueueTable',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    jobs: {
      control: 'object',
      description: 'Array of render jobs',
    },
    onRetry: { action: 'onRetry' },
    onCancel: { action: 'onCancel' },
    onView: { action: 'onView' },
    onDelete: { action: 'onDelete' },
  },
};

export default meta;
type Story = StoryObj<typeof RenderQueueTable>;

const sampleJobs: RenderJob[] = [
  {
    id: '1',
    sceneId: '1',
    status: 'done',
    progress: 100,
    eta: 0,
    tokensUsed: 12503,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    thumbnailUrl: 'https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: '2',
    sceneId: '2',
    status: 'running',
    progress: 68,
    eta: 120,
    tokensUsed: 8754,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(),
    thumbnailUrl: 'https://images.pexels.com/photos/1604141/pexels-photo-1604141.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: '3',
    sceneId: '3',
    status: 'queued',
    progress: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: '4',
    sceneId: '4',
    status: 'error',
    progress: 23,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4.8),
  },
];

export const WithJobs: Story = {
  args: {
    jobs: sampleJobs,
    onRetry: (id) => console.log('Retry job:', id),
    onCancel: (id) => console.log('Cancel job:', id),
    onView: (id) => console.log('View job:', id),
    onDelete: (id) => console.log('Delete job:', id),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '900px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    jobs: [],
    onRetry: (id) => console.log('Retry job:', id),
    onCancel: (id) => console.log('Cancel job:', id),
    onView: (id) => console.log('View job:', id),
    onDelete: (id) => console.log('Delete job:', id),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '900px' }}>
        <Story />
      </div>
    ),
  ],
};

export const ReadOnly: Story = {
  args: {
    jobs: sampleJobs,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '900px' }}>
        <Story />
      </div>
    ),
  ],
};
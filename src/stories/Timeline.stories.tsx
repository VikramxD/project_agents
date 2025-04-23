import type { Meta, StoryObj } from '@storybook/react';
import Timeline from '@/components/Timeline';
import { Scene } from '@/types';

const meta: Meta<typeof Timeline> = {
  component: Timeline,
  title: 'Components/Timeline',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    scenes: {
      control: 'object',
      description: 'Array of scenes in the timeline',
    },
    onReorder: { action: 'onReorder' },
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
    onAdd: { action: 'onAdd' },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const sampleScenes: Scene[] = [
  {
    id: '1',
    name: 'Opening Scene',
    description: 'A dark alley in a cyberpunk city. Rain pours as our hero approaches.',
    order: 1,
    thumbnailUrl: 'https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: '2',
    name: 'The Meeting',
    description: 'Hero meets the informant at a crowded neon-lit bar.',
    order: 2,
    thumbnailUrl: 'https://images.pexels.com/photos/1604141/pexels-photo-1604141.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: '3',
    name: 'The Chase',
    description: 'Protagonist pursued through narrow streets after information is revealed.',
    order: 3,
    thumbnailUrl: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
];

export const WithScenes: Story = {
  args: {
    scenes: sampleScenes,
    onReorder: (scenes) => console.log('Reorder scenes:', scenes),
    onEdit: (scene) => console.log('Edit scene:', scene),
    onDelete: (id) => console.log('Delete scene:', id),
    onAdd: () => console.log('Add scene clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    scenes: [],
    onReorder: (scenes) => console.log('Reorder scenes:', scenes),
    onEdit: (scene) => console.log('Edit scene:', scene),
    onDelete: (id) => console.log('Delete scene:', id),
    onAdd: () => console.log('Add scene clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export const ReadOnly: Story = {
  args: {
    scenes: sampleScenes,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
};
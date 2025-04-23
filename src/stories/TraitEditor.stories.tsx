import type { Meta, StoryObj } from '@storybook/react';
import TraitEditor from '@/components/TraitEditor';
import { Trait } from '@/types';

const meta: Meta<typeof TraitEditor> = {
  component: TraitEditor,
  title: 'Components/TraitEditor',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    traits: {
      control: 'object',
      description: 'Array of character traits',
    },
    characterId: {
      control: 'text',
      description: 'ID of the character being edited',
    },
    onAddTrait: { action: 'onAddTrait' },
    onUpdateTrait: { action: 'onUpdateTrait' },
    onDeleteTrait: { action: 'onDeleteTrait' },
  },
};

export default meta;
type Story = StoryObj<typeof TraitEditor>;

const sampleTraits: Trait[] = [
  { id: '1', key: 'Age', value: '35', characterId: '1' },
  { id: '2', key: 'Height', value: '6\'2"', characterId: '1' },
  { id: '3', key: 'Personality', value: 'Stoic, determined', characterId: '1' },
  { id: '4', key: 'Background', value: 'Former military', characterId: '1' },
];

export const WithTraits: Story = {
  args: {
    traits: sampleTraits,
    characterId: '1',
    onAddTrait: (trait) => console.log('Add trait:', trait),
    onUpdateTrait: (trait) => console.log('Update trait:', trait),
    onDeleteTrait: (id) => console.log('Delete trait:', id),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    traits: [],
    characterId: '1',
    onAddTrait: (trait) => console.log('Add trait:', trait),
    onUpdateTrait: (trait) => console.log('Update trait:', trait),
    onDeleteTrait: (id) => console.log('Delete trait:', id),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const ReadOnly: Story = {
  args: {
    traits: sampleTraits,
    characterId: '1',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};
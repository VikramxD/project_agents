import type { Meta, StoryObj } from '@storybook/react';
import ImageDropzone from '@/components/ImageDropzone';

const meta: Meta<typeof ImageDropzone> = {
  component: ImageDropzone,
  title: 'Components/ImageDropzone',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onUpload: { action: 'onUpload' },
    onRemove: { action: 'onRemove' },
    image: {
      control: 'text',
      description: 'URL of the currently uploaded image',
    },
    dropzoneText: {
      control: 'text',
      description: 'Text to display in the dropzone',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageDropzone>;

export const Empty: Story = {
  args: {
    onUpload: (file) => console.log('File uploaded:', file.name),
    dropzoneText: 'Drop image here or click to upload',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '250px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithImage: Story = {
  args: {
    onUpload: (file) => console.log('File uploaded:', file.name),
    onRemove: () => console.log('Remove clicked'),
    image: 'https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '250px' }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomText: Story = {
  args: {
    onUpload: (file) => console.log('File uploaded:', file.name),
    dropzoneText: 'Upload a character image',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '250px' }}>
        <Story />
      </div>
    ),
  ],
};
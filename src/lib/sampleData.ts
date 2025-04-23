import { Agent, Project, RenderJob, Scene, Trait, User } from '@/types';

export const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Research Bot',
    status: 'idle',
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    type: 'research',
  },
  {
    id: '2',
    name: 'Character Designer',
    status: 'working',
    lastRunAt: new Date(),
    type: 'character',
  },
  {
    id: '3',
    name: 'Story Crafter',
    status: 'idle',
    lastRunAt: new Date(Date.now() - 1000 * 60 * 30),
    type: 'storyboard',
  },
  {
    id: '4',
    name: 'Visual Renderer',
    status: 'error',
    lastRunAt: new Date(Date.now() - 1000 * 60 * 10),
    type: 'renderer',
  },
];

export const sampleTraits: Trait[] = [
  { id: '1', key: 'Age', value: '35', characterId: '1' },
  { id: '2', key: 'Height', value: '6\'2"', characterId: '1' },
  { id: '3', key: 'Personality', value: 'Stoic, determined', characterId: '1' },
  { id: '4', key: 'Background', value: 'Former military', characterId: '1' },
  { id: '5', key: 'Age', value: '28', characterId: '2' },
  { id: '6', key: 'Height', value: '5\'7"', characterId: '2' },
  { id: '7', key: 'Personality', value: 'Witty, resourceful', characterId: '2' },
  { id: '8', key: 'Background', value: 'Tech genius', characterId: '2' },
];

export const sampleScenes: Scene[] = [
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
  {
    id: '4',
    name: 'Final Confrontation',
    description: 'Showdown on the rooftop of a skyscraper.',
    order: 4,
    thumbnailUrl: 'https://images.pexels.com/photos/1112186/pexels-photo-1112186.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
];

export const sampleRenderJobs: RenderJob[] = [
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

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Neon Shadows',
    description: 'A cyberpunk thriller about a detective uncovering a conspiracy.',
    coverImage: 'https://images.pexels.com/photos/3265460/pexels-photo-3265460.jpeg?auto=compress&cs=tinysrgb&w=1600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
    scenes: sampleScenes,
    characters: [
      {
        id: '1',
        name: 'Alex Mercer',
        projectId: '1',
        imageUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1600',
        traits: sampleTraits.filter(t => t.characterId === '1'),
      },
      {
        id: '2',
        name: 'Zoe Chen',
        projectId: '1',
        imageUrl: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1600',
        traits: sampleTraits.filter(t => t.characterId === '2'),
      },
    ],
    renderJobs: sampleRenderJobs,
  },
  {
    id: '2',
    name: 'Stellar Odyssey',
    description: 'An epic space adventure spanning galaxies.',
    coverImage: 'https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg?auto=compress&cs=tinysrgb&w=1600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    scenes: [],
    characters: [],
    renderJobs: [],
  },
  {
    id: '3',
    name: 'Ghost Chronicles',
    description: 'A supernatural mystery set in a small coastal town.',
    coverImage: 'https://images.pexels.com/photos/3617457/pexels-photo-3617457.jpeg?auto=compress&cs=tinysrgb&w=1600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    scenes: [],
    characters: [],
    renderJobs: [],
  },
];

export const sampleUser: User = {
  id: '1',
  name: 'Alex Director',
  email: 'alex@agentjump.studio',
  avatarUrl: 'https://images.pexels.com/photos/14715541/pexels-photo-14715541.jpeg?auto=compress&cs=tinysrgb&w=1600',
  apiKeys: [
    {
      id: '1',
      name: 'OpenAI API Key',
      lastUsed: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      name: 'Stability API Key',
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],
};
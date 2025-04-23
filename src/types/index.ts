// Data contract interfaces
export interface Scene {
  id: string;
  name: string;
  description: string;
  order: number;
  thumbnailUrl?: string;
}

export interface Trait {
  id: string;
  key: string;
  value: string;
  characterId: string;
}

export interface RenderJob {
  id: string;
  sceneId: string;
  status: 'queued' | 'running' | 'done' | 'error';
  progress: number;
  eta?: number;
  tokensUsed?: number;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl?: string;
}

export interface Character {
  id: string;
  name: string;
  projectId: string;
  imageUrl?: string;
  traits: Trait[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  scenes: Scene[];
  characters: Character[];
  renderJobs: RenderJob[];
}

export interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'error';
  lastRunAt?: Date;
  type: 'research' | 'character' | 'storyboard' | 'renderer';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  apiKeys: {
    id: string;
    name: string;
    lastUsed?: Date;
  }[];
}

export interface AppState {
  projects: Project[];
  currentProject?: Project;
  agents: Agent[];
  user?: User;
  isDarkMode: boolean;
}
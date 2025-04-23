import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Agent, AppState, Project, RenderJob, Scene, User } from '@/types';
import { sampleAgents, sampleProjects, sampleUser } from '@/lib/sampleData';

interface AppStore extends AppState {
  // Projects
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | undefined) => void;
  
  // Scenes
  addScene: (projectId: string, scene: Scene) => void;
  updateScene: (projectId: string, scene: Scene) => void;
  deleteScene: (projectId: string, sceneId: string) => void;
  reorderScenes: (projectId: string, scenes: Scene[]) => void;
  
  // Render Jobs
  addRenderJob: (projectId: string, job: RenderJob) => void;
  updateRenderJob: (projectId: string, job: RenderJob) => void;
  
  // Agents
  setAgents: (agents: Agent[]) => void;
  updateAgent: (agent: Agent) => void;
  
  // User
  setUser: (user: User | undefined) => void;
  
  // Theme
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        projects: sampleProjects,
        currentProject: undefined,
        agents: sampleAgents,
        user: sampleUser,
        isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        
        // Project actions
        setProjects: (projects) => set({ projects }),
        addProject: (project) => set((state) => ({ 
          projects: [...state.projects, project] 
        })),
        updateProject: (project) => set((state) => ({ 
          projects: state.projects.map((p) => p.id === project.id ? project : p),
          currentProject: state.currentProject?.id === project.id ? project : state.currentProject
        })),
        deleteProject: (id) => set((state) => ({ 
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? undefined : state.currentProject
        })),
        setCurrentProject: (project) => set({ currentProject: project }),
        
        // Scene actions
        addScene: (projectId, scene) => set((state) => ({
          projects: state.projects.map((p) => 
            p.id === projectId 
              ? { ...p, scenes: [...p.scenes, scene] } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId 
            ? { ...state.currentProject, scenes: [...state.currentProject.scenes, scene] }
            : state.currentProject
        })),
        updateScene: (projectId, scene) => set((state) => ({
          projects: state.projects.map((p) => 
            p.id === projectId 
              ? { 
                  ...p, 
                  scenes: p.scenes.map((s) => s.id === scene.id ? scene : s) 
                } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId 
            ? { 
                ...state.currentProject, 
                scenes: state.currentProject.scenes.map((s) => 
                  s.id === scene.id ? scene : s
                ) 
              }
            : state.currentProject
        })),
        deleteScene: (projectId, sceneId) => set((state) => ({
          projects: state.projects.map((p) => 
            p.id === projectId 
              ? { ...p, scenes: p.scenes.filter((s) => s.id !== sceneId) } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId 
            ? { 
                ...state.currentProject, 
                scenes: state.currentProject.scenes.filter((s) => s.id !== sceneId) 
              }
            : state.currentProject
        })),
        reorderScenes: (projectId, scenes) => set((state) => ({
          projects: state.projects.map((p) => 
            p.id === projectId ? { ...p, scenes } : p
          ),
          currentProject: state.currentProject?.id === projectId 
            ? { ...state.currentProject, scenes }
            : state.currentProject
        })),
        
        // Render job actions
        addRenderJob: (projectId, job) => set((state) => ({
          projects: state.projects.map((p) => 
            p.id === projectId 
              ? { ...p, renderJobs: [...p.renderJobs, job] } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId 
            ? { 
                ...state.currentProject, 
                renderJobs: [...state.currentProject.renderJobs, job] 
              }
            : state.currentProject
        })),
        updateRenderJob: (projectId, job) => set((state) => ({
          projects: state.projects.map((p) => 
            p.id === projectId 
              ? { 
                  ...p, 
                  renderJobs: p.renderJobs.map((j) => j.id === job.id ? job : j) 
                } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId 
            ? { 
                ...state.currentProject, 
                renderJobs: state.currentProject.renderJobs.map((j) => 
                  j.id === job.id ? job : j
                ) 
              }
            : state.currentProject
        })),
        
        // Agent actions
        setAgents: (agents) => set({ agents }),
        updateAgent: (agent) => set((state) => ({
          agents: state.agents.map((a) => a.id === agent.id ? agent : a)
        })),
        
        // User actions
        setUser: (user) => set({ user }),
        
        // Theme actions
        toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        setDarkMode: (isDark) => set({ isDarkMode: isDark })
      }),
      {
        name: 'agent-jump-studio-storage',
      }
    )
  )
);
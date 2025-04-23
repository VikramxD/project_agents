import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useAppStore } from '@/store/store';
import Sidebar from '@/components/layout/Sidebar';

export default function ProjectLayout() {
  const { id } = useParams<{ id: string }>();
  const projects = useAppStore((state) => state.projects);
  const currentProject = useAppStore((state) => state.currentProject);
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  
  // Set current project from URL
  useEffect(() => {
    if (id && (!currentProject || currentProject.id !== id)) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [id, projects, currentProject, setCurrentProject]);
  
  // Update document title
  useEffect(() => {
    if (currentProject) {
      document.title = `${currentProject.name} - AgentJump Studio`;
    } else {
      document.title = 'AgentJump Studio';
    }
    
    return () => {
      document.title = 'AgentJump Studio';
    };
  }, [currentProject]);
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
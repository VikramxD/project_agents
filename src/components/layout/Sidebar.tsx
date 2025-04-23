import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Film, 
  Video, 
  PanelLeft,
  PanelRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/store';
import { Separator } from '@/components/ui/separator';

export function Sidebar() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentProject = useAppStore((state) => state.currentProject);
  const projects = useAppStore((state) => state.projects);
  
  // Set current project from URL if needed
  useEffect(() => {
    if (id && (!currentProject || currentProject.id !== id)) {
      const project = projects.find(p => p.id === id);
      if (project) {
        useAppStore.getState().setCurrentProject(project);
      }
    }
  }, [id, currentProject, projects]);
  
  if (!currentProject || !location.pathname.includes('/projects/')) {
    return null;
  }
  
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };
  
  return (
    <aside className={cn(
      "sticky top-16 hidden h-[calc(100vh-4rem)] bg-background transition-all duration-300 md:block",
      collapsed ? "w-[60px]" : "w-[240px]"
    )}>
      <div className="flex h-full flex-col border-r">
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <h2 className="line-clamp-1 flex-1 text-sm font-semibold">
              {currentProject.name}
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <Separator />
        
        <nav className="flex-1 space-y-2 p-2">
          <Link to={`/projects/${id}/research`}>
            <Button 
              variant={isActive('/research') ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start text-left",
                collapsed ? "justify-center" : ""
              )}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              {!collapsed && <span>Research</span>}
            </Button>
          </Link>
          
          <Link to={`/projects/${id}/characters`}>
            <Button 
              variant={isActive('/characters') ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start text-left",
                collapsed ? "justify-center" : ""
              )}
            >
              <Users className="mr-2 h-5 w-5" />
              {!collapsed && <span>Characters</span>}
            </Button>
          </Link>
          
          <Link to={`/projects/${id}/storyboard`}>
            <Button 
              variant={isActive('/storyboard') ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start text-left",
                collapsed ? "justify-center" : ""
              )}
            >
              <Film className="mr-2 h-5 w-5" />
              {!collapsed && <span>Storyboard</span>}
            </Button>
          </Link>
          
          <Link to={`/projects/${id}/shots`}>
            <Button 
              variant={isActive('/shots') ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start text-left",
                collapsed ? "justify-center" : ""
              )}
            >
              <Video className="mr-2 h-5 w-5" />
              {!collapsed && <span>Shots</span>}
            </Button>
          </Link>
        </nav>
        
        {!collapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(currentProject.updatedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
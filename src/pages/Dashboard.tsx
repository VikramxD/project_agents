import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FilmIcon, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/types';
import ImageDropzone from '@/components/ImageDropzone';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const showNewDialog = searchParams.get('new') === '1';
  
  const projects = useAppStore((state) => state.projects);
  const addProject = useAppStore((state) => state.addProject);
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    coverImage: '',
  });
  
  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      coverImage: newProject.coverImage,
      createdAt: new Date(),
      updatedAt: new Date(),
      scenes: [],
      characters: [],
      renderJobs: [],
    };
    
    addProject(project);
    setNewProject({ name: '', description: '', coverImage: '' });
    setSearchParams({});
    navigate(`/projects/${project.id}/research`);
  };
  
  const handleCloseDialog = () => {
    setSearchParams({});
  };
  
  const handleOpenProject = (projectId: string) => {
    navigate(`/projects/${projectId}/research`);
  };
  
  const handleImageUpload = (file: File) => {
    // In a real app, you would upload the file to a server
    // For this example, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    setNewProject({ ...newProject, coverImage: imageUrl });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };
  
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your movie production projects
          </p>
        </div>
        <Button onClick={() => setSearchParams({ new: '1' })}>
          <Plus className="mr-1 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <FilmIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-medium">No projects yet</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Create your first project to get started with AgentJump Studio
          </p>
          <Button onClick={() => setSearchParams({ new: '1' })}>
            <Plus className="mr-1 h-4 w-4" />
            Create Your First Project
          </Button>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card 
                className="group overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-md"
                onClick={() => handleOpenProject(project.id)}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FilmIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>
                        {project.scenes.length} {project.scenes.length === 1 ? 'scene' : 'scenes'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      <span>
                        {project.characters.length} {project.characters.length === 1 ? 'character' : 'characters'}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <Dialog open={showNewDialog} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add the details for your new movie production project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="e.g., Stellar Odyssey"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Briefly describe your project"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <ImageDropzone
                onUpload={handleImageUpload}
                image={newProject.coverImage}
                onRemove={() => setNewProject({ ...newProject, coverImage: '' })}
                className="aspect-video h-[180px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProject.name.trim()}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Agent, Scene } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AgentCard from '@/components/AgentCard';
import ProgressBanner from '@/components/ProgressBanner';
import Timeline from '@/components/Timeline';
import ImageDropzone from '@/components/ImageDropzone';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function StoryboardPage() {
  const currentProject = useAppStore((state) => state.currentProject);
  const agents = useAppStore((state) => state.agents);
  const updateAgent = useAppStore((state) => state.updateAgent);
  const reorderScenes = useAppStore((state) => state.reorderScenes);
  
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [sceneForm, setSceneForm] = useState({
    name: '',
    description: '',
    thumbnailUrl: '',
  });
  
  if (!currentProject) {
    return (
      <div className="container py-8">
        <p>Project not found</p>
      </div>
    );
  }
  
  const storyboardAgents = agents.filter(
    (agent) => agent.type === 'storyboard'
  );
  
  const handleRunAgent = (agent: Agent) => {
    // Update agent status to working
    updateAgent({ ...agent, status: 'working', lastRunAt: new Date() });
    
    // Show progress banner
    setShowProgress(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Reset agent status after "completion"
          setTimeout(() => {
            updateAgent({ ...agent, status: 'idle', lastRunAt: new Date() });
            setShowProgress(false);
            
            // If there are no scenes, create some sample ones
            if (currentProject.scenes.length === 0) {
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
              
              // Update the project with the sample scenes
              useAppStore.getState().updateProject({
                ...currentProject,
                scenes: sampleScenes,
              });
            }
          }, 1000);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  const handleAddScene = () => {
    // Reset form and open dialog
    setSceneForm({
      name: '',
      description: '',
      thumbnailUrl: '',
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };
  
  const handleEditScene = (scene: Scene) => {
    // Set form values and open dialog
    setSceneForm({
      name: scene.name,
      description: scene.description,
      thumbnailUrl: scene.thumbnailUrl || '',
    });
    setCurrentScene(scene);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteScene = (sceneId: string) => {
    if (!currentProject) return;
    
    // Filter out the scene to delete
    const updatedScenes = currentProject.scenes.filter(
      (scene) => scene.id !== sceneId
    );
    
    // Reorder the remaining scenes
    const reorderedScenes = updatedScenes.map((scene, index) => ({
      ...scene,
      order: index + 1,
    }));
    
    // Update the project
    useAppStore.getState().updateProject({
      ...currentProject,
      scenes: reorderedScenes,
    });
  };
  
  const handleSaveScene = () => {
    if (!currentProject || !sceneForm.name.trim()) return;
    
    if (isEditMode && currentScene) {
      // Update existing scene
      const updatedScene: Scene = {
        ...currentScene,
        name: sceneForm.name,
        description: sceneForm.description,
        thumbnailUrl: sceneForm.thumbnailUrl,
      };
      
      // Update the scene in the project
      const updatedScenes = currentProject.scenes.map((scene) =>
        scene.id === currentScene.id ? updatedScene : scene
      );
      
      // Update the project
      useAppStore.getState().updateProject({
        ...currentProject,
        scenes: updatedScenes,
      });
    } else {
      // Create new scene
      const newScene: Scene = {
        id: Date.now().toString(),
        name: sceneForm.name,
        description: sceneForm.description,
        order: currentProject.scenes.length + 1,
        thumbnailUrl: sceneForm.thumbnailUrl,
      };
      
      // Add the new scene to the project
      useAppStore.getState().updateProject({
        ...currentProject,
        scenes: [...currentProject.scenes, newScene],
      });
    }
    
    // Close the dialog
    setIsDialogOpen(false);
  };
  
  const handleReorderScenes = (reorderedScenes: Scene[]) => {
    if (!currentProject) return;
    
    // Update the scenes in the project
    reorderScenes(currentProject.id, reorderedScenes);
  };
  
  const handleImageUpload = (file: File) => {
    // In a real app, we would upload this to a server
    // For this example, we'll just use the local URL
    const imageUrl = URL.createObjectURL(file);
    setSceneForm({ ...sceneForm, thumbnailUrl: imageUrl });
  };
  
  return (
    <>
      {showProgress && (
        <ProgressBanner
          percent={progress}
          eta={Math.round((100 - progress) * 0.3)}
          tokensUsed={Math.round(progress * 120)}
          message="Generating storyboard..."
          onClose={() => setShowProgress(false)}
        />
      )}
      
      <div className="container max-w-6xl py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Storyboard</h1>
            <p className="text-muted-foreground">
              Create and arrange scenes for your film
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleRunAgent(storyboardAgents[0])}>
              Generate Storyboard
            </Button>
            <Button onClick={handleAddScene}>
              <Plus className="mr-1 h-4 w-4" />
              Add Scene
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Timeline
              scenes={currentProject.scenes}
              onReorder={handleReorderScenes}
              onEdit={handleEditScene}
              onDelete={handleDeleteScene}
              onAdd={handleAddScene}
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Storyboard Agents</h2>
            
            <div className="grid gap-4">
              {storyboardAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  status={agent.status}
                  lastRunAt={agent.lastRunAt}
                  onRun={() => handleRunAgent(agent)}
                />
              ))}
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Storyboard Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Total Scenes</dt>
                    <dd className="text-2xl font-bold">{currentProject.scenes.length}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Estimated Runtime</dt>
                    <dd className="text-2xl font-bold">{currentProject.scenes.length * 3} min</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Characters Used</dt>
                    <dd className="text-2xl font-bold">{currentProject.characters.length}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Last Updated</dt>
                    <dd className="font-medium">Today</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Scene' : 'Add New Scene'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the details of this scene'
                : 'Add a new scene to your storyboard'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="scene-name">Scene Name</Label>
              <Input
                id="scene-name"
                value={sceneForm.name}
                onChange={(e) => setSceneForm({ ...sceneForm, name: e.target.value })}
                placeholder="e.g., Opening Scene"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="scene-description">Description</Label>
              <Textarea
                id="scene-description"
                value={sceneForm.description}
                onChange={(e) => setSceneForm({ ...sceneForm, description: e.target.value })}
                placeholder="Describe what happens in this scene..."
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Scene Thumbnail</Label>
              <ImageDropzone
                onUpload={handleImageUpload}
                image={sceneForm.thumbnailUrl}
                onRemove={() => setSceneForm({ ...sceneForm, thumbnailUrl: '' })}
                className="aspect-video h-[150px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveScene}
              disabled={!sceneForm.name.trim()}
            >
              {isEditMode ? 'Update Scene' : 'Add Scene'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
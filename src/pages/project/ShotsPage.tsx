import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Agent, RenderJob } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import AgentCard from '@/components/AgentCard';
import ProgressBanner from '@/components/ProgressBanner';
import RenderQueueTable from '@/components/RenderQueueTable';
import { FilmIcon, Play, Settings } from 'lucide-react';

export default function ShotsPage() {
  const currentProject = useAppStore((state) => state.currentProject);
  const agents = useAppStore((state) => state.agents);
  const updateAgent = useAppStore((state) => state.updateAgent);
  
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [isRenderDialogOpen, setIsRenderDialogOpen] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string>('');
  const [renderSettings, setRenderSettings] = useState({
    quality: 80,
    style: 'realistic',
  });
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedJob, setSelectedJob] = useState<RenderJob | null>(null);
  
  if (!currentProject) {
    return (
      <div className="container py-8">
        <p>Project not found</p>
      </div>
    );
  }
  
  const renderAgents = agents.filter(
    (agent) => agent.type === 'renderer'
  );
  
  const handleRunAgent = (agent: Agent) => {
    // Update agent status to working
    updateAgent({ ...agent, status: 'working', lastRunAt: new Date() });
    
    // If currently rendering, update progress
    if (isRendering) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Reset agent status after "completion"
            setTimeout(() => {
              updateAgent({ ...agent, status: 'idle', lastRunAt: new Date() });
              setShowProgress(false);
              setIsRendering(false);
              
              // Update the job to "done" status
              if (currentProject && selectedSceneId) {
                const runningJob = currentProject.renderJobs.find(
                  (job) => job.sceneId === selectedSceneId && job.status === 'running'
                );
                
                if (runningJob) {
                  const updatedJob: RenderJob = {
                    ...runningJob,
                    status: 'done',
                    progress: 100,
                    updatedAt: new Date(),
                    thumbnailUrl: currentProject.scenes.find(
                      (scene) => scene.id === selectedSceneId
                    )?.thumbnailUrl,
                  };
                  
                  useAppStore.getState().updateRenderJob(currentProject.id, updatedJob);
                }
              }
            }, 1000);
            
            return 100;
          }
          
          // Update the job progress
          if (currentProject && selectedSceneId) {
            const runningJob = currentProject.renderJobs.find(
              (job) => job.sceneId === selectedSceneId && job.status === 'running'
            );
            
            if (runningJob) {
              const updatedJob: RenderJob = {
                ...runningJob,
                progress: Math.round(newProgress),
                updatedAt: new Date(),
              };
              
              useAppStore.getState().updateRenderJob(currentProject.id, updatedJob);
            }
          }
          
          return newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  };
  
  const handleStartRender = () => {
    if (!currentProject || !selectedSceneId) return;
    
    // Create a new render job
    const newJob: RenderJob = {
      id: Date.now().toString(),
      sceneId: selectedSceneId,
      status: 'running',
      progress: 0,
      eta: 300, // 5 minutes
      tokensUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Add the job to the project
    useAppStore.getState().addRenderJob(currentProject.id, newJob);
    
    // Start the rendering process
    setIsRendering(true);
    setShowProgress(true);
    setProgress(0);
    setIsRenderDialogOpen(false);
    
    // Update the agent status
    const agent = renderAgents.find((a) => a.status !== 'working');
    if (agent) {
      handleRunAgent(agent);
    }
    
    // Switch to the queue tab to show progress
    setActiveTab('queue');
  };
  
  const handleRetry = (jobId: string) => {
    if (!currentProject) return;
    
    const job = currentProject.renderJobs.find((j) => j.id === jobId);
    if (!job) return;
    
    // Update the job status
    const updatedJob: RenderJob = {
      ...job,
      status: 'running',
      progress: 0,
      updatedAt: new Date(),
    };
    
    useAppStore.getState().updateRenderJob(currentProject.id, updatedJob);
    
    // Set as the current job
    setSelectedSceneId(updatedJob.sceneId);
    
    // Start the rendering process
    setIsRendering(true);
    setShowProgress(true);
    setProgress(0);
    
    // Update the agent status
    const agent = renderAgents.find((a) => a.status !== 'working');
    if (agent) {
      handleRunAgent(agent);
    }
  };
  
  const handleCancel = (jobId: string) => {
    if (!currentProject) return;
    
    const job = currentProject.renderJobs.find((j) => j.id === jobId);
    if (!job) return;
    
    // Update the job status
    const updatedJob: RenderJob = {
      ...job,
      status: 'error',
      updatedAt: new Date(),
    };
    
    useAppStore.getState().updateRenderJob(currentProject.id, updatedJob);
  };
  
  const handleViewJob = (jobId: string) => {
    if (!currentProject) return;
    
    const job = currentProject.renderJobs.find((j) => j.id === jobId);
    if (!job) return;
    
    setSelectedJob(job);
    setActiveTab('preview');
  };
  
  return (
    <>
      {showProgress && (
        <ProgressBanner
          percent={progress}
          eta={Math.round((100 - progress) * 3)}
          tokensUsed={Math.round(progress * 150)}
          message={`Rendering scene: ${
            currentProject.scenes.find((s) => s.id === selectedSceneId)?.name ||
            'Selected scene'
          }`}
          onClose={() => setShowProgress(false)}
        />
      )}
      
      <div className="container max-w-6xl py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Shots</h1>
            <p className="text-muted-foreground">
              Render and preview shots from your storyboard
            </p>
          </div>
          
          <Button onClick={() => setIsRenderDialogOpen(true)}>
            <Play className="mr-1 h-4 w-4" />
            Render Shot
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="queue">Render Queue</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="queue" className="space-y-4">
                <RenderQueueTable
                  jobs={currentProject.renderJobs}
                  onRetry={handleRetry}
                  onCancel={handleCancel}
                  onView={handleViewJob}
                />
              </TabsContent>
              
              <TabsContent value="preview">
                {selectedJob && selectedJob.status === 'done' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {
                          currentProject.scenes.find(
                            (s) => s.id === selectedJob.sceneId
                          )?.name || 'Rendered Scene'
                        }
                      </CardTitle>
                      <CardDescription>
                        Rendered {new Date(selectedJob.updatedAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedJob.thumbnailUrl ? (
                        <div className="aspect-video overflow-hidden rounded-md">
                          <img
                            src={selectedJob.thumbnailUrl}
                            alt="Rendered scene"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center rounded-md border">
                          <FilmIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <FilmIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <h3 className="mb-1 text-lg font-medium">No preview available</h3>
                      <p className="text-sm text-muted-foreground">
                        Select a completed render from the queue to preview it here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Render Settings</CardTitle>
                    <CardDescription>
                      Configure the settings for your renders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="render-quality">Render Quality</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <Slider
                            id="render-quality"
                            value={[renderSettings.quality]}
                            onValueChange={(values) =>
                              setRenderSettings({ ...renderSettings, quality: values[0] })
                            }
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <span className="min-w-16 rounded-md border p-2 text-center text-sm">
                            {renderSettings.quality}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="render-style">Visual Style</Label>
                        <Select
                          value={renderSettings.style}
                          onValueChange={(value) =>
                            setRenderSettings({ ...renderSettings, style: value })
                          }
                        >
                          <SelectTrigger id="render-style">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realistic">Realistic</SelectItem>
                            <SelectItem value="stylized">Stylized</SelectItem>
                            <SelectItem value="anime">Anime</SelectItem>
                            <SelectItem value="noir">Film Noir</SelectItem>
                            <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Render Agents</h2>
            
            <div className="grid gap-4">
              {renderAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  status={agent.status}
                  lastRunAt={agent.lastRunAt}
                />
              ))}
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Render Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Total Renders</dt>
                    <dd className="text-2xl font-bold">{currentProject.renderJobs.length}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Completed</dt>
                    <dd className="text-2xl font-bold">
                      {
                        currentProject.renderJobs.filter(
                          (job) => job.status === 'done'
                        ).length
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">In Progress</dt>
                    <dd className="text-2xl font-bold">
                      {
                        currentProject.renderJobs.filter(
                          (job) => job.status === 'running' || job.status === 'queued'
                        ).length
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Last Render</dt>
                    <dd className="font-medium">
                      {currentProject.renderJobs.length > 0
                        ? new Date(
                            Math.max(
                              ...currentProject.renderJobs.map((job) =>
                                new Date(job.updatedAt).getTime()
                              )
                            )
                          ).toLocaleDateString()
                        : 'Never'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isRenderDialogOpen} onOpenChange={setIsRenderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Render Shot</DialogTitle>
            <DialogDescription>
              Select a scene to render and configure render settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scene-select">Select Scene</Label>
              <Select
                value={selectedSceneId}
                onValueChange={setSelectedSceneId}
              >
                <SelectTrigger id="scene-select">
                  <SelectValue placeholder="Choose a scene to render" />
                </SelectTrigger>
                <SelectContent>
                  {currentProject.scenes.map((scene) => (
                    <SelectItem key={scene.id} value={scene.id}>
                      {scene.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="render-quality">Render Quality</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="render-quality"
                  value={[renderSettings.quality]}
                  onValueChange={(values) =>
                    setRenderSettings({ ...renderSettings, quality: values[0] })
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="min-w-16 rounded-md border p-2 text-center text-sm">
                  {renderSettings.quality}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="render-style">Visual Style</Label>
              <Select
                value={renderSettings.style}
                onValueChange={(value) =>
                  setRenderSettings({ ...renderSettings, style: value })
                }
              >
                <SelectTrigger id="render-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="stylized">Stylized</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="noir">Film Noir</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenderDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStartRender}
              disabled={!selectedSceneId}
            >
              <Settings className="mr-1 h-4 w-4" />
              Start Rendering
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
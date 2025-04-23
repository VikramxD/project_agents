import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AgentCard from '@/components/AgentCard';
import ProgressBanner from '@/components/ProgressBanner';
import { ClipboardList, Link2, Plus, Search } from 'lucide-react';
import { Agent } from '@/types';

export default function ResearchPage() {
  const { id } = useParams<{ id: string }>();
  const currentProject = useAppStore((state) => state.currentProject);
  const agents = useAppStore((state) => state.agents);
  const updateAgent = useAppStore((state) => state.updateAgent);
  
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [researchTopic, setResearchTopic] = useState('');
  const [prompt, setPrompt] = useState('');
  
  if (!currentProject) {
    return (
      <div className="container py-8">
        <p>Project not found</p>
      </div>
    );
  }
  
  const researchAgents = agents.filter(
    (agent) => agent.type === 'research'
  );
  
  const handleRunAgent = (agent: Agent) => {
    // Update agent status to working
    updateAgent({ ...agent, status: 'working', lastRunAt: new Date() });
    
    // Show progress banner
    setShowProgress(true);
    setProgress(0);
    setProgressMessage(`${agent.name} is researching "${researchTopic || 'the project'}"...`);
    
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
            
            // Simulate search results
            setSearchResults([
              'Cyberpunk aesthetic in modern cinema',
              'Neo-noir influences in science fiction',
              'Urban dystopias in film',
              'Blade Runner visual analysis',
              'Neon lighting techniques in cinematography',
              'Cyberpunk character archetypes',
              'Retrofuturism in visual storytelling',
              'AI and human identity in science fiction',
              'Cyberpunk worldbuilding elements',
            ]);
          }, 1000);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  const filteredResults = searchQuery
    ? searchResults.filter((result) =>
        result.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchResults;
  
  return (
    <>
      {showProgress && (
        <ProgressBanner
          percent={progress}
          eta={Math.round((100 - progress) * 0.3)}
          tokensUsed={Math.round(progress * 120)}
          message={progressMessage}
          onClose={() => setShowProgress(false)}
        />
      )}
      
      <div className="container max-w-6xl py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">{currentProject.name} Research</h1>
            <p className="text-muted-foreground">
              Use AI agents to research topics for your film
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Research Brief</CardTitle>
                <CardDescription>
                  Define what you want to research for your film
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="topic">Research Topic</Label>
                    <Input
                      id="topic"
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      placeholder="e.g., Cyberpunk aesthetic in film"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="prompt">Research Prompt</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Provide detailed instructions for the research agent..."
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Research results will appear in the sidebar
                </p>
                <Button
                  disabled={!researchTopic.trim()}
                  onClick={() => {
                    const agent = researchAgents.find(a => a.status !== 'working');
                    if (agent) {
                      handleRunAgent(agent);
                    }
                  }}
                >
                  <ClipboardList className="mr-1 h-4 w-4" />
                  Start Research
                </Button>
              </CardFooter>
            </Card>
            
            <Tabs defaultValue="results">
              <TabsList className="mb-4">
                <TabsTrigger value="results">Search Results</TabsTrigger>
                <TabsTrigger value="sources">Source Links</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in results..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {filteredResults.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <h3 className="mb-1 text-lg font-medium">No results yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Run a research agent to get started, or search for different terms.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredResults.map((result, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-0">
                          <button className="w-full text-left transition-colors hover:bg-muted/50">
                            <div className="p-4">
                              <h3 className="font-medium">{result}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Click to view detailed research about {result.toLowerCase()}
                              </p>
                            </div>
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sources">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Source Links</CardTitle>
                    <CardDescription>
                      External references and resources for your research
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-muted-foreground" />
                          <span>The Evolution of Cyberpunk in Cinema</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Visit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-muted-foreground" />
                          <span>Visual Techniques in Neo-Noir Filmmaking</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Visit
                        </Button>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Source Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Research Agents</h2>
            
            <div className="grid gap-4">
              {researchAgents.map((agent) => (
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
                <CardTitle className="text-lg">Research Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Topics Researched</dt>
                    <dd className="text-2xl font-bold">3</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Sources Gathered</dt>
                    <dd className="text-2xl font-bold">12</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Research Sessions</dt>
                    <dd className="text-2xl font-bold">5</dd>
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
    </>
  );
}
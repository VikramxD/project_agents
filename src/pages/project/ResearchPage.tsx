import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#181c24] font-sans">
      {showProgress && (
        <ProgressBanner
          percent={progress}
          eta={Math.round((100 - progress) * 0.3)}
          tokensUsed={Math.round(progress * 120)}
          message={progressMessage}
          onClose={() => setShowProgress(false)}
        />
      )}
      <div className="flex min-h-screen">
        {/* Glassy Sidebar */}
        <aside className="w-full max-w-xs bg-[#232a36]/80 backdrop-blur-lg border-r border-slate-800 p-6 flex flex-col gap-6 shadow-xl rounded-r-3xl">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 tracking-tight">Research</h1>
            <p className="text-muted-foreground text-sm mb-4">Use AI agents to research topics for your film</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-200">Research Agents</h2>
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
          </div>
          <Card className="bg-[#232a36]/90 rounded-2xl shadow-lg border-0 mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Research Stats</CardTitle>
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
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-4xl">
            <Card className="rounded-3xl shadow-2xl border-0 bg-[#232a36]/90 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight">Research Brief</CardTitle>
                <CardDescription>Define what you want to research for your film</CardDescription>
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
                      className="rounded-xl bg-[#181c24] text-white border-slate-700"
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
                      className="rounded-xl bg-[#181c24] text-white border-slate-700"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4">
                <p className="text-xs text-muted-foreground">Research results will appear below</p>
                <Button
                  disabled={!researchTopic.trim()}
                  onClick={() => {
                    const agent = researchAgents.find(a => a.status !== 'working');
                    if (agent) {
                      handleRunAgent(agent);
                    }
                  }}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105 transition-transform px-6 py-2 text-base font-semibold"
                >
                  <ClipboardList className="mr-1 h-4 w-4" />
                  Start Research
                </Button>
              </CardFooter>
            </Card>
            <Tabs defaultValue="results">
              <TabsList className="mb-4 rounded-full bg-[#232a36]/80 p-1 flex gap-2">
                <TabsTrigger value="results" className="rounded-full px-6 py-2 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Search Results</TabsTrigger>
                <TabsTrigger value="sources" className="rounded-full px-6 py-2 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Source Links</TabsTrigger>
              </TabsList>
              <TabsContent value="results" className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in results..."
                    className="pl-9 rounded-xl bg-[#181c24] text-white border-slate-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {filteredResults.length === 0 ? (
                  <Card className="rounded-2xl bg-[#232a36]/80 border-0 shadow-md">
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
                      <Card key={index} className="overflow-hidden rounded-2xl bg-[#232a36]/80 border-0 shadow-md">
                        <CardContent className="p-0">
                          <button className="w-full text-left transition-colors hover:bg-blue-900/20 rounded-2xl">
                            <div className="p-4">
                              <h3 className="font-medium text-white">{result}</h3>
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
                <Card className="rounded-2xl bg-[#232a36]/80 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Source Links</CardTitle>
                    <CardDescription>External references and resources for your research</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-md border border-slate-700 p-3">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-white">The Evolution of Cyberpunk in Cinema</span>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full">Visit</Button>
                      </div>
                      <div className="flex items-center justify-between rounded-md border border-slate-700 p-3">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-white">Visual Techniques in Neo-Noir Filmmaking</span>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full">Visit</Button>
                      </div>
                      <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105 transition-transform">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Source Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
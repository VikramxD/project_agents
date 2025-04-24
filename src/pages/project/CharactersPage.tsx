import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AgentCard from '@/components/AgentCard';
import TraitEditor from '@/components/TraitEditor';
import ImageDropzone from '@/components/ImageDropzone';
import ProgressBanner from '@/components/ProgressBanner';
import { Character, Trait } from '@/types';
import { Plus, RefreshCcw, UserCircle, X } from 'lucide-react';

export default function CharactersPage() {
  const currentProject = useAppStore((state) => state.currentProject);
  const agents = useAppStore((state) => state.agents);
  const updateAgent = useAppStore((state) => state.updateAgent);
  
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    imageUrl: '',
  });
  
  if (!currentProject) {
    return (
      <div className="container py-8">
        <p>Project not found</p>
      </div>
    );
  }
  
  const characterAgents = agents.filter(
    (agent) => agent.type === 'character'
  );
  
  const handleAddTrait = (trait: Omit<Trait, 'id'>) => {
    if (!selectedCharacter || !currentProject) return;
    
    const newTrait: Trait = {
      ...trait,
      id: Date.now().toString(),
    };
    
    // Update the selected character with the new trait
    const updatedCharacter: Character = {
      ...selectedCharacter,
      traits: [...selectedCharacter.traits, newTrait],
    };
    
    // Update the selected character in the current project
    const updatedCharacters = currentProject.characters.map((char) =>
      char.id === selectedCharacter.id ? updatedCharacter : char
    );
    
    // Update the project in the store
    useAppStore.getState().updateProject({
      ...currentProject,
      characters: updatedCharacters,
    });
    
    // Update the selected character
    setSelectedCharacter(updatedCharacter);
  };
  
  const handleUpdateTrait = (updatedTrait: Trait) => {
    if (!selectedCharacter || !currentProject) return;
    
    // Update the trait in the selected character
    const updatedTraits = selectedCharacter.traits.map((trait) =>
      trait.id === updatedTrait.id ? updatedTrait : trait
    );
    
    // Update the selected character with the updated traits
    const updatedCharacter: Character = {
      ...selectedCharacter,
      traits: updatedTraits,
    };
    
    // Update the selected character in the current project
    const updatedCharacters = currentProject.characters.map((char) =>
      char.id === selectedCharacter.id ? updatedCharacter : char
    );
    
    // Update the project in the store
    useAppStore.getState().updateProject({
      ...currentProject,
      characters: updatedCharacters,
    });
    
    // Update the selected character
    setSelectedCharacter(updatedCharacter);
  };
  
  const handleDeleteTrait = (traitId: string) => {
    if (!selectedCharacter || !currentProject) return;
    
    // Remove the trait from the selected character
    const updatedTraits = selectedCharacter.traits.filter(
      (trait) => trait.id !== traitId
    );
    
    // Update the selected character with the updated traits
    const updatedCharacter: Character = {
      ...selectedCharacter,
      traits: updatedTraits,
    };
    
    // Update the selected character in the current project
    const updatedCharacters = currentProject.characters.map((char) =>
      char.id === selectedCharacter.id ? updatedCharacter : char
    );
    
    // Update the project in the store
    useAppStore.getState().updateProject({
      ...currentProject,
      characters: updatedCharacters,
    });
    
    // Update the selected character
    setSelectedCharacter(updatedCharacter);
  };
  
  const handleCreateCharacter = () => {
    if (!currentProject || !newCharacter.name.trim()) return;
    
    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name,
      projectId: currentProject.id,
      imageUrl: newCharacter.imageUrl,
      traits: [],
    };
    
    // Update the project in the store
    useAppStore.getState().updateProject({
      ...currentProject,
      characters: [...currentProject.characters, character],
    });
    
    // Reset the form and close it
    setNewCharacter({ name: '', imageUrl: '' });
    setIsCreatingCharacter(false);
    
    // Select the new character
    setSelectedCharacter(character);
  };
  
  const handleDeleteCharacter = (characterId: string) => {
    if (!currentProject) return;
    
    // Remove the character from the project
    const updatedCharacters = currentProject.characters.filter(
      (char) => char.id !== characterId
    );
    
    // Update the project in the store
    useAppStore.getState().updateProject({
      ...currentProject,
      characters: updatedCharacters,
    });
    
    // If the deleted character was selected, clear the selection
    if (selectedCharacter?.id === characterId) {
      setSelectedCharacter(null);
    }
  };
  
  const handleRunAgent = (agentId: string) => {
    const agent = characterAgents.find((a) => a.id === agentId);
    if (!agent) return;
    
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
            
            // Add a sample trait if a character is selected
            if (selectedCharacter) {
              handleAddTrait({
                key: 'Generated Trait',
                value: 'This is a sample generated trait',
                characterId: selectedCharacter.id,
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
  
  const handleImageUpload = (file: File) => {
    // In a real app, we would upload this to a server
    // For this example, we'll just use the local URL
    const imageUrl = URL.createObjectURL(file);
    
    if (selectedCharacter) {
      // Update the selected character with the new image
      const updatedCharacter: Character = {
        ...selectedCharacter,
        imageUrl,
      };
      
      // Update the character in the project
      const updatedCharacters = currentProject.characters.map((char) =>
        char.id === selectedCharacter.id ? updatedCharacter : char
      );
      
      // Update the project in the store
      useAppStore.getState().updateProject({
        ...currentProject,
        characters: updatedCharacters,
      });
      
      // Update the selected character
      setSelectedCharacter(updatedCharacter);
    } else {
      // For the new character form
      setNewCharacter({ ...newCharacter, imageUrl });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] dark:from-[#181c24] dark:via-[#232a36] dark:to-[#181c24] font-sans">
      {showProgress && (
        <ProgressBanner
          percent={progress}
          eta={Math.round((100 - progress) * 0.3)}
          tokensUsed={Math.round(progress * 120)}
          message="Generating character traits..."
          onClose={() => setShowProgress(false)}
        />
      )}
      <div className="flex min-h-screen">
        {/* Glassy Sidebar */}
        <aside className="w-full max-w-xs bg-white/60 dark:bg-[#232a36]/70 backdrop-blur-lg border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 shadow-xl rounded-r-3xl">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 tracking-tight">Characters</h1>
            <p className="text-muted-foreground text-sm mb-4">Create and manage characters for your film</p>
            <Button onClick={() => setIsCreatingCharacter(true)} className="w-full rounded-full py-2 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-transform">
              <Plus className="mr-1 h-5 w-5" /> New Character
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Card className="bg-white/80 dark:bg-[#232a36]/80 rounded-2xl shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Character List</CardTitle>
                <CardDescription>Select a character to edit</CardDescription>
              </CardHeader>
              <CardContent>
                {currentProject.characters.length === 0 ? (
                  <div className="py-8 text-center">
                    <UserCircle className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="mb-4 text-sm text-muted-foreground">No characters created yet</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingCharacter(true)}
                      className="rounded-full"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Create Character
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentProject.characters.map((character) => (
                      <div 
                        key={character.id} 
                        className={`flex cursor-pointer items-center justify-between rounded-xl p-2 transition-all ${
                          selectedCharacter?.id === character.id
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 shadow-lg'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                        onClick={() => setSelectedCharacter(character)}
                      >
                        <div className="flex items-center gap-3">
                          {character.imageUrl ? (
                            <img 
                              src={character.imageUrl} 
                              alt={character.name} 
                              className="h-10 w-10 rounded-full object-cover border-2 border-blue-400 shadow"
                            />
                          ) : (
                            <UserCircle className="h-10 w-10 text-muted-foreground" />
                          )}
                          <span className="font-medium text-base">{character.name}</span>
                        </div>
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCharacter(character.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Character Agents</h2>
            {characterAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                status={agent.status}
                lastRunAt={agent.lastRunAt}
                onRun={() => handleRunAgent(agent.id)}
              />
            ))}
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-3xl">
            {selectedCharacter ? (
              <div className="space-y-8">
                <Card className="rounded-3xl shadow-2xl border-0 bg-white/90 dark:bg-[#232a36]/90">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">{selectedCharacter.name}</CardTitle>
                    <CardDescription>Edit character details and appearance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-6">
                        <div className="grid gap-2">
                          <Label htmlFor="char-name">Name</Label>
                          <Input
                            id="char-name"
                            value={selectedCharacter.name}
                            onChange={(e) => {
                              const updatedCharacter = {
                                ...selectedCharacter,
                                name: e.target.value,
                              };
                              setSelectedCharacter(updatedCharacter);
                              // Update in the store
                              const updatedCharacters = currentProject.characters.map(
                                (char) => (char.id === selectedCharacter.id ? updatedCharacter : char)
                              );
                              useAppStore.getState().updateProject({
                                ...currentProject,
                                characters: updatedCharacters,
                              });
                            }}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Character Summary</Label>
                          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-4 text-sm shadow-inner">
                            <p>
                              {selectedCharacter.traits.length > 0
                                ? `${selectedCharacter.name} is a ${
                                    selectedCharacter.traits.find((t) => t.key === 'Age')?.value || ''
                                  } year old ${
                                    selectedCharacter.traits.find((t) => t.key === 'Occupation')?.value || 'character'
                                  } who is ${
                                    selectedCharacter.traits.find((t) => t.key === 'Personality')?.value || 'mysterious'
                                  }.`
                                : `No character details available yet. Add traits to generate a summary.`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 flex flex-col items-center">
                        <Label>Character Image</Label>
                        <ImageDropzone
                          onUpload={handleImageUpload}
                          image={selectedCharacter.imageUrl}
                          onRemove={() => {
                            const updatedCharacter = {
                              ...selectedCharacter,
                              imageUrl: '',
                            };
                            setSelectedCharacter(updatedCharacter);
                            // Update in the store
                            const updatedCharacters = currentProject.characters.map(
                              (char) => (char.id === selectedCharacter.id ? updatedCharacter : char)
                            );
                            useAppStore.getState().updateProject({
                              ...currentProject,
                              characters: updatedCharacters,
                            });
                          }}
                          className="aspect-square h-40 w-40 rounded-2xl border-2 border-blue-300 shadow-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t pt-4">
                    <Button variant="outline" onClick={() => handleRunAgent(characterAgents[0].id)} className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105 transition-transform">
                      <RefreshCcw className="mr-1 h-4 w-4" />
                      Generate Traits
                    </Button>
                  </CardFooter>
                </Card>
                <TraitEditor
                  traits={selectedCharacter.traits}
                  characterId={selectedCharacter.id}
                  onAddTrait={handleAddTrait}
                  onUpdateTrait={handleUpdateTrait}
                  onDeleteTrait={handleDeleteTrait}
                />
              </div>
            ) : isCreatingCharacter ? (
              <Card className="rounded-3xl shadow-2xl border-0 bg-white/90 dark:bg-[#232a36]/90">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Create New Character</CardTitle>
                  <CardDescription>Add a new character to your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-char-name">Character Name</Label>
                        <Input
                          id="new-char-name"
                          value={newCharacter.name}
                          onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                          placeholder="e.g., Alex Mercer"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col items-center">
                      <Label>Character Image</Label>
                      <ImageDropzone
                        onUpload={handleImageUpload}
                        image={newCharacter.imageUrl}
                        onRemove={() => setNewCharacter({ ...newCharacter, imageUrl: '' })}
                        className="aspect-square h-40 w-40 rounded-2xl border-2 border-blue-300 shadow-lg"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => setIsCreatingCharacter(false)} className="rounded-full">Cancel</Button>
                  <Button
                    onClick={handleCreateCharacter}
                    disabled={!newCharacter.name.trim()}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105 transition-transform"
                  >
                    Create Character
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed p-12 text-center bg-white/80 dark:bg-[#232a36]/80 shadow-xl">
                <UserCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">No Character Selected</h2>
                <p className="mb-6 max-w-md text-muted-foreground">
                  Select a character from the list or create a new one to start editing
                </p>
                <Button onClick={() => setIsCreatingCharacter(true)} className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105 transition-transform">
                  <Plus className="mr-1 h-4 w-4" />
                  Create New Character
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
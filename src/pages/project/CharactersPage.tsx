import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentCard from '@/components/AgentCard';
import TraitEditor from '@/components/TraitEditor';
import ImageDropzone from '@/components/ImageDropzone';
import ProgressBanner from '@/components/ProgressBanner';
import { Character, Trait } from '@/types';
import { Plus, RefreshCcw, UserCircle, X } from 'lucide-react';

export default function CharactersPage() {
  const { id } = useParams<{ id: string }>();
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
    <>
      {showProgress && (
        <ProgressBanner
          percent={progress}
          eta={Math.round((100 - progress) * 0.3)}
          tokensUsed={Math.round(progress * 120)}
          message="Generating character traits..."
          onClose={() => setShowProgress(false)}
        />
      )}
      
      <div className="container max-w-6xl py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Characters</h1>
            <p className="text-muted-foreground">
              Create and manage characters for your film
            </p>
          </div>
          
          <Button onClick={() => setIsCreatingCharacter(true)}>
            <Plus className="mr-1 h-4 w-4" />
            New Character
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Character List</CardTitle>
                <CardDescription>
                  Select a character to edit their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentProject.characters.length === 0 ? (
                  <div className="py-8 text-center">
                    <UserCircle className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="mb-4 text-sm text-muted-foreground">
                      No characters created yet
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingCharacter(true)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Create Character
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentProject.characters.map((character) => (
                      <div 
                        key={character.id} 
                        className={`flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors ${
                          selectedCharacter?.id === character.id
                            ? 'bg-secondary'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedCharacter(character)}
                      >
                        <div className="flex items-center gap-3">
                          {character.imageUrl ? (
                            <img 
                              src={character.imageUrl} 
                              alt={character.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircle className="h-10 w-10 text-muted-foreground" />
                          )}
                          <span className="font-medium">{character.name}</span>
                        </div>
                        
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
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
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Character Agents</h2>
              
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
          </div>
          
          <div className="lg:col-span-2">
            {selectedCharacter ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCharacter.name}</CardTitle>
                    <CardDescription>
                      Edit character details and appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
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
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Character Summary</Label>
                          <div className="rounded-md bg-muted p-3 text-sm">
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
                      
                      <div className="space-y-2">
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
                          className="aspect-square h-full max-h-[250px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t pt-4">
                    <Button variant="outline" onClick={() => handleRunAgent(characterAgents[0].id)}>
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
              <Card>
                <CardHeader>
                  <CardTitle>Create New Character</CardTitle>
                  <CardDescription>
                    Add a new character to your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-char-name">Character Name</Label>
                        <Input
                          id="new-char-name"
                          value={newCharacter.name}
                          onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                          placeholder="e.g., Alex Mercer"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Character Image</Label>
                      <ImageDropzone
                        onUpload={handleImageUpload}
                        image={newCharacter.imageUrl}
                        onRemove={() => setNewCharacter({ ...newCharacter, imageUrl: '' })}
                        className="aspect-square h-full"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => setIsCreatingCharacter(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCharacter}
                    disabled={!newCharacter.name.trim()}
                  >
                    Create Character
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <UserCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">No Character Selected</h2>
                <p className="mb-6 max-w-md text-muted-foreground">
                  Select a character from the list or create a new one to start editing
                </p>
                <Button onClick={() => setIsCreatingCharacter(true)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Create New Character
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
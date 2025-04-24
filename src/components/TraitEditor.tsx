import { useState } from 'react';
import { Trait } from '@/types';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TraitEditorProps {
  traits: Trait[];
  onAddTrait?: (trait: Omit<Trait, 'id'>) => void;
  onUpdateTrait?: (trait: Trait) => void;
  onDeleteTrait?: (id: string) => void;
  characterId: string;
  className?: string;
}

export function TraitEditor({
  traits,
  onAddTrait,
  onUpdateTrait,
  onDeleteTrait,
  characterId,
  className,
}: TraitEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingTrait, setEditingTrait] = useState<Trait | null>(null);
  
  const handleAddTrait = () => {
    if (newKey.trim() && newValue.trim() && onAddTrait) {
      onAddTrait({
        key: newKey,
        value: newValue,
        characterId,
      });
      
      setNewKey('');
      setNewValue('');
    }
  };
  
  const handleStartEdit = (trait: Trait) => {
    setEditingTrait({ ...trait });
  };
  
  const handleCancelEdit = () => {
    setEditingTrait(null);
  };
  
  const handleSaveEdit = () => {
    if (editingTrait && onUpdateTrait) {
      onUpdateTrait(editingTrait);
      setEditingTrait(null);
    }
  };
  
  const handleDeleteTrait = (id: string) => {
    if (onDeleteTrait) {
      onDeleteTrait(id);
    }
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Character Traits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {traits.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No traits defined yet. Add some traits to define this character.
          </p>
        ) : (
          <div className="space-y-3">
            {traits.map((trait) => (
              <div key={trait.id} className="space-y-2">
                {editingTrait && editingTrait.id === trait.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editingTrait.key}
                        onChange={(e) => setEditingTrait({ ...editingTrait, key: e.target.value })}
                        placeholder="Trait name"
                      />
                      <Input
                        value={editingTrait.value}
                        onChange={(e) => setEditingTrait({ ...editingTrait, value: e.target.value })}
                        placeholder="Trait value"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveEdit}
                      >
                        <Save className="mr-1 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <h4 className="font-medium">{trait.key}</h4>
                      <p className="text-sm text-muted-foreground">{trait.value}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleStartEdit(trait)}
                        className="h-8 w-8"
                      >
                        <svg 
                          width="15" 
                          height="15" 
                          viewBox="0 0 15 15" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                      {onDeleteTrait && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDeleteTrait(trait.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {onAddTrait && (
          <>
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Add New Trait</h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Trait name (e.g., Age)"
                />
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value (e.g., 30)"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      {onAddTrait && (
        <CardFooter>
          <Button
            onClick={handleAddTrait}
            disabled={!newKey.trim() || !newValue.trim()}
            className="ml-auto"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Add Trait
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default TraitEditor;
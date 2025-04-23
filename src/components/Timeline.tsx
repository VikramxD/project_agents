import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Scene } from '@/types';
import { AlertCircle, Trash2, Plus, Move } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimelineProps {
  scenes: Scene[];
  onReorder?: (scenes: Scene[]) => void;
  onEdit?: (scene: Scene) => void;
  onDelete?: (sceneId: string) => void;
  onAdd?: () => void;
  className?: string;
}

export function Timeline({
  scenes,
  onReorder,
  onEdit,
  onDelete,
  onAdd,
  className,
}: TimelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const handleDragEnd = (result: DropResult) => {
    setActiveId(null);
    
    if (!result.destination || !onReorder) {
      return;
    }
    
    const items = Array.from(scenes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the order property of each scene
    const reorderedScenes = items.map((scene, index) => ({
      ...scene,
      order: index + 1,
    }));
    
    onReorder(reorderedScenes);
  };
  
  const handleDragStart = (start: any) => {
    setActiveId(start.draggableId);
  };
  
  return (
    <div className={cn("", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Scene Timeline</h3>
        {onAdd && (
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Scene
          </Button>
        )}
      </div>
      
      {scenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium">No scenes yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first scene to start building your storyboard.
          </p>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-1 h-4 w-4" />
              Create First Scene
            </Button>
          )}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <Droppable droppableId="scenes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {scenes.map((scene, index) => (
                  <Draggable key={scene.id} draggableId={scene.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "transition-shadow",
                          snapshot.isDragging && "rounded-md shadow-lg"
                        )}
                      >
                        <Card className={cn(
                          "border",
                          activeId === scene.id && "border-primary",
                          snapshot.isDragging && "border-primary"
                        )}>
                          <CardContent className="p-0">
                            <div className="flex items-start gap-3 p-3">
                              <div 
                                {...provided.dragHandleProps}
                                className="mt-1 cursor-grab rounded p-1 hover:bg-muted active:cursor-grabbing"
                              >
                                <Move className="h-5 w-5 text-muted-foreground" />
                              </div>
                              
                              <div className="min-w-10 flex-shrink-0 rounded-md bg-muted p-1 text-center">
                                <span className="text-xs font-medium uppercase text-muted-foreground">
                                  Scene
                                </span>
                                <p className="text-lg font-bold">{scene.order}</p>
                              </div>
                              
                              <div className="flex-grow">
                                <h4 className="font-medium">{scene.name}</h4>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                  {scene.description}
                                </p>
                              </div>
                              
                              {scene.thumbnailUrl && (
                                <div className="flex-shrink-0 overflow-hidden rounded-md">
                                  <img 
                                    src={scene.thumbnailUrl} 
                                    alt={scene.name} 
                                    className="h-16 w-24 object-cover"
                                  />
                                </div>
                              )}
                              
                              <div className="ml-auto flex flex-shrink-0 gap-1">
                                {onEdit && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onEdit(scene)}
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
                                )}
                                
                                {onDelete && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onDelete(scene.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

export default Timeline;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Bot, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AgentCardProps {
  name: string;
  status: 'idle' | 'working' | 'error';
  lastRunAt?: Date;
  onRun?: () => void;
  className?: string;
}

export function AgentCard({ name, status, lastRunAt, onRun, className }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    idle: "bg-muted text-muted-foreground",
    working: "bg-blue-500 text-white",
    error: "bg-red-500 text-white"
  };
  
  const statusIcons = {
    idle: <Clock className="h-4 w-4" />,
    working: <Bot className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />
  };
  
  const statusText = {
    idle: "Idle",
    working: "Working",
    error: "Error"
  };
  
  const getLastRunText = () => {
    if (!lastRunAt) return "Never run";
    
    return `Last run ${formatDistanceToNow(lastRunAt, { addSuffix: true })}`;
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn("", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cn(
        "transition-all duration-300",
        isHovered ? "shadow-lg" : "shadow-md",
        status === 'error' && "border-red-500"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className={cn(
                "h-5 w-5",
                status === 'working' && "text-blue-500",
                status === 'error' && "text-red-500"
              )} />
              <h3 className="font-medium">{name}</h3>
            </div>
            <Badge variant="outline" className={cn("ml-2", statusColors[status])}>
              {statusIcons[status]}
              <span className="ml-1">{statusText[status]}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {status === 'working' 
              ? 'Currently processing your request...' 
              : 'Ready to assist with your project.'}
          </p>
        </CardContent>
        <CardFooter className="justify-between border-t pt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {getLastRunText()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {lastRunAt ? format(lastRunAt, 'PPpp') : 'Never run'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onRun && (
            <button
              onClick={onRun}
              className="text-xs font-medium text-primary hover:underline"
              disabled={status === 'working'}
            >
              {status === 'working' ? 'Running...' : 'Run agent'}
            </button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default AgentCard;
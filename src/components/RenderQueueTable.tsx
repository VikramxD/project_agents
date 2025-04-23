import { useState } from 'react';
import { RenderJob } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MoreVertical, PlayCircle, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RenderQueueTableProps {
  jobs: RenderJob[];
  onRetry?: (jobId: string) => void;
  onCancel?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  className?: string;
}

export function RenderQueueTable({
  jobs,
  onRetry,
  onCancel,
  onView,
  onDelete,
  className,
}: RenderQueueTableProps) {
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  
  const getStatusIcon = (status: RenderJob['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="mr-1 h-4 w-4 text-muted-foreground" />;
      case 'running':
        return <PlayCircle className="mr-1 h-4 w-4 text-blue-500" />;
      case 'done':
        return <CheckCircle className="mr-1 h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: RenderJob['status']) => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'running':
        return 'Running';
      case 'done':
        return 'Complete';
      case 'error':
        return 'Failed';
      default:
        return status;
    }
  };
  
  const getStatusVariant = (status: RenderJob['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'queued':
        return 'outline';
      case 'running':
        return 'secondary';
      case 'done':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  if (jobs.length === 0) {
    return (
      <div className={cn("rounded-md border p-8 text-center", className)}>
        <h3 className="mb-2 font-medium">No render jobs</h3>
        <p className="text-sm text-muted-foreground">
          When you create render jobs, they will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Tokens</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow 
              key={job.id}
              className="group"
              onMouseEnter={() => setHoveredJob(job.id)}
              onMouseLeave={() => setHoveredJob(null)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {job.thumbnailUrl && (
                    <div className="overflow-hidden rounded-md">
                      <img 
                        src={job.thumbnailUrl} 
                        alt="Render preview" 
                        className="h-8 w-12 object-cover"
                      />
                    </div>
                  )}
                  <Badge variant={getStatusVariant(job.status)}>
                    {getStatusIcon(job.status)}
                    {getStatusText(job.status)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex w-full max-w-[120px] items-center gap-2">
                  <Progress value={job.progress} className="h-2" />
                  <span className="min-w-9 text-xs text-muted-foreground">
                    {job.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {format(job.createdAt, 'MMM d, h:mm a')}
              </TableCell>
              <TableCell className="text-sm">
                {format(job.updatedAt, 'MMM d, h:mm a')}
              </TableCell>
              <TableCell className="text-sm">
                {job.tokensUsed ? job.tokensUsed.toLocaleString() : '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {job.status === 'done' && onView && (
                      <DropdownMenuItem onClick={() => onView(job.id)}>
                        View Result
                      </DropdownMenuItem>
                    )}
                    {job.status === 'error' && onRetry && (
                      <DropdownMenuItem onClick={() => onRetry(job.id)}>
                        Retry Job
                      </DropdownMenuItem>
                    )}
                    {job.status === 'queued' && onCancel && (
                      <DropdownMenuItem onClick={() => onCancel(job.id)}>
                        Cancel Job
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(job.id)}
                        className="text-destructive"
                      >
                        Delete Job
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default RenderQueueTable;
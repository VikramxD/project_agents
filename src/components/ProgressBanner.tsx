import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { X, Clock, Zap } from 'lucide-react';

interface ProgressBannerProps {
  percent: number;
  eta?: number;
  tokensUsed?: number;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export function ProgressBanner({ 
  percent, 
  eta, 
  tokensUsed, 
  message, 
  onClose,
  className 
}: ProgressBannerProps) {
  const [visible, setVisible] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  
  useEffect(() => {
    if (eta !== undefined) {
      if (eta <= 0) {
        setEstimatedTime('Complete');
      } else if (eta < 60) {
        setEstimatedTime(`${Math.round(eta)} seconds remaining`);
      } else {
        const minutes = Math.floor(eta / 60);
        const seconds = Math.round(eta % 60);
        setEstimatedTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutes remaining`);
      }
    }
  }, [eta]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow animation to complete
    }
  };
  
  if (!visible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 right-0 top-16 z-40 mx-auto flex max-w-4xl flex-col space-y-2 rounded-b-lg border bg-background p-4 shadow-md",
          className
        )}
        aria-live="polite"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {percent < 100 && <Clock className="h-5 w-5 text-primary" />}
            {percent >= 100 && <Zap className="h-5 w-5 text-green-500" />}
            <h3 className="font-medium">{message || (percent < 100 ? 'Processing...' : 'Complete!')}</h3>
          </div>
          
          {onClose && (
            <button 
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Progress value={percent} className="h-2" />
        
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>{percent.toFixed(0)}% Complete</div>
          
          {estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {estimatedTime}
            </div>
          )}
          
          {tokensUsed !== undefined && (
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {tokensUsed.toLocaleString()} tokens
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProgressBanner;
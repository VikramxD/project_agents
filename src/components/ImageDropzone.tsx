import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageDropzoneProps {
  onUpload: (file: File) => void;
  image?: string;
  onRemove?: () => void;
  className?: string;
  dropzoneText?: string;
}

export function ImageDropzone({ 
  onUpload, 
  image, 
  onRemove, 
  className,
  dropzoneText = 'Drop image here or click to upload'
}: ImageDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
  });
  
  if (image) {
    return (
      <div className={cn("group relative overflow-hidden rounded-md", className)}>
        <img 
          src={image} 
          alt="Uploaded" 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-black hover:bg-gray-100 hover:text-black"
              {...getRootProps()}
            >
              <Upload className="mr-1 h-4 w-4" />
              Replace
              <input {...getInputProps()} />
            </Button>
            
            {onRemove && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemove}
              >
                <X className="mr-1 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-muted-foreground/50",
        isDragActive && "border-primary bg-primary/5",
        className
      )}
    >
      <input {...getInputProps()} />
      <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
      <p className="text-center text-sm text-muted-foreground">{dropzoneText}</p>
      <p className="mt-2 text-center text-xs text-muted-foreground">PNG, JPG or GIF, max 5MB</p>
    </div>
  );
}

export default ImageDropzone;
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Film, Moon, Sun, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/store';
import CommandPalette from '@/components/CommandPalette';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const user = useAppStore((state) => state.user);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      
      // g + d to focus dashboard
      if (e.key === 'g' && !isCommandPaletteOpen) {
        const keyTimeout = setTimeout(() => {
          clearTimeout(keyTimeout);
        }, 500);
        
        const secondKeyHandler = (e2: KeyboardEvent) => {
          if (e2.key === 'd') {
            clearTimeout(keyTimeout);
            window.location.href = '/dashboard';
          }
          document.removeEventListener('keydown', secondKeyHandler);
        };
        
        document.addEventListener('keydown', secondKeyHandler);
      }
      
      // g + p to focus projects
      if (e.key === 'g' && !isCommandPaletteOpen) {
        const keyTimeout = setTimeout(() => {
          clearTimeout(keyTimeout);
        }, 500);
        
        const secondKeyHandler = (e2: KeyboardEvent) => {
          if (e2.key === 'p') {
            clearTimeout(keyTimeout);
            // Focus the first project if we're on the dashboard
            const projectLinks = document.querySelectorAll('a[href^="/projects/"]');
            if (projectLinks.length > 0) {
              (projectLinks[0] as HTMLElement).focus();
            }
          }
          document.removeEventListener('keydown', secondKeyHandler);
        };
        
        document.addEventListener('keydown', secondKeyHandler);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCommandPaletteOpen]);

  // Update document class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur transition-all">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold transition-colors hover:text-primary">
              <Film className="h-6 w-6" />
              <span className="hidden sm:inline-block">AgentJump Studio</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link 
              to="/dashboard" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link 
              to="/settings" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/settings" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Settings
            </Link>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCommandPaletteOpen(true)} 
                aria-label="Open command palette"
              >
                <Command className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              {user && (
                <Button variant="ghost" className="ml-2 flex items-center gap-2">
                  <img 
                    src={user.avatarUrl || 'https://images.pexels.com/photos/14715541/pexels-photo-14715541.jpeg?auto=compress&cs=tinysrgb&w=1600'} 
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="hidden lg:inline-block">{user.name}</span>
                </Button>
              )}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-start bg-background pt-16 md:hidden">
          <nav className="flex w-full flex-col p-4">
            <Link 
              to="/dashboard" 
              className="w-full py-3 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/settings" 
              className="w-full py-3 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCommandPaletteOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <Command className="mr-2 h-4 w-4" />
                Command Palette
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </nav>
        </div>
      )}
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </>
  );
}

export default Navbar;
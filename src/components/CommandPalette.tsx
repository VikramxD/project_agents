import { Fragment, useState, useEffect } from 'react';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, FilmIcon, Users, Settings } from 'lucide-react';
import { useAppStore } from '@/store/store';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const projects = useAppStore((state) => state.projects);
  
  // All available commands
  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      name: 'Go to Dashboard',
      icon: <Zap className="h-5 w-5" />,
      shortcut: 'g d',
      action: () => navigate('/dashboard'),
    },
    {
      id: 'settings',
      name: 'Go to Settings',
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate('/settings'),
    },
    ...projects.map(project => ({
      id: `project-${project.id}`,
      name: `Open Project: ${project.name}`,
      icon: <FilmIcon className="h-5 w-5" />,
      action: () => navigate(`/projects/${project.id}`),
    })),
    {
      id: 'create-project',
      name: 'Create New Project',
      icon: <FilmIcon className="h-5 w-5" />,
      action: () => navigate('/dashboard?new=1'),
    },
    {
      id: 'characters',
      name: 'Manage Characters',
      icon: <Users className="h-5 w-5" />,
      action: () => {
        const currentProject = useAppStore.getState().currentProject;
        if (currentProject) {
          navigate(`/projects/${currentProject.id}/characters`);
        }
      },
    },
  ];
  
  // Filter commands based on search query
  const filteredCommands = query === ''
    ? commands
    : commands.filter((command) => {
        return command.name.toLowerCase().includes(query.toLowerCase());
      });
      
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  return (
    <Transition.Root show={isOpen} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="mx-auto max-w-xl overflow-hidden rounded-lg border bg-background shadow-2xl">
            <Combobox onChange={(item: CommandItem) => {
              onClose();
              item.action();
            }}>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-foreground focus:outline-none focus:ring-0"
                  placeholder="Search commands..."
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {filteredCommands.length > 0 && (
                <Combobox.Options static className="max-h-80 scroll-p-4 overflow-y-auto p-2">
                  {filteredCommands.map((item) => (
                    <Combobox.Option
                      key={item.id}
                      value={item}
                      className={({ active }) =>
                        `flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm ${
                          active ? 'bg-secondary text-secondary-foreground' : 'text-foreground'
                        }`
                      }
                    >
                      {({ active }) => (
                        <>
                          <div className="mr-3 flex h-6 w-6 flex-none items-center justify-center rounded-md border">
                            {item.icon}
                          </div>
                          <div className="flex-auto truncate">{item.name}</div>
                          {item.shortcut && (
                            <div className="ml-3 flex-none text-xs text-muted-foreground">
                              <kbd className="rounded border bg-muted px-1.5 font-mono">
                                {item.shortcut}
                              </kbd>
                            </div>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}

              {query && filteredCommands.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No commands found.</p>
                </div>
              )}
            </Combobox>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
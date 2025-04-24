import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Key, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import ImageDropzone from '@/components/ImageDropzone';
import { User } from '@/types';

export default function Settings() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  });
  
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      setUser({
        ...user,
        name: profileForm.name,
        email: profileForm.email,
        avatarUrl: profileForm.avatarUrl,
      });
    }
  };
  
  const handleAddApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user && newKeyName.trim() && newKeyValue.trim()) {
      const updatedUser: User = {
        ...user,
        apiKeys: [
          ...user.apiKeys,
          {
            id: Date.now().toString(),
            name: newKeyName,
            lastUsed: new Date(),
          },
        ],
      };
      
      setUser(updatedUser);
      setNewKeyName('');
      setNewKeyValue('');
    }
  };
  
  const handleDeleteApiKey = (keyId: string) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        apiKeys: user.apiKeys.filter((key) => key.id !== keyId),
      };
      
      setUser(updatedUser);
    }
  };
  
  const handleImageUpload = (file: File) => {
    // In a real app, you would upload the file to a server
    // For this example, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    setProfileForm({ ...profileForm, avatarUrl: imageUrl });
  };
  
  if (!user) return null;
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and how it appears in the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="sm:w-1/3">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="mt-2">
                      <ImageDropzone
                        onUpload={handleImageUpload}
                        image={profileForm.avatarUrl}
                        onRemove={() => setProfileForm({ ...profileForm, avatarUrl: '' })}
                        className="h-32 w-32 rounded-full"
                        dropzoneText="Upload photo"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 sm:w-2/3">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage the API keys used for AI services and integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Your API Keys</h3>
                  
                  {user.apiKeys.length === 0 ? (
                    <div className="rounded-md border border-dashed p-4 text-center">
                      <Key className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        You don't have any API keys yet. Add one to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {user.apiKeys.map((key) => (
                        <div
                          key={key.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{key.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {key.lastUsed ? (
                                  <span className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    Last used {format(new Date(key.lastUsed), 'MMM d, yyyy h:mm a')}
                                  </span>
                                ) : (
                                  'Never used'
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteApiKey(key.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Add New API Key</h3>
                  
                  <form onSubmit={handleAddApiKey} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="key-name">Key Name</Label>
                      <Input
                        id="key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., OpenAI API Key"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="key-value">
                        API Key
                        <Badge variant="outline" className="ml-2">
                          Securely Stored
                        </Badge>
                      </Label>
                      <Input
                        id="key-value"
                        type="password"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        placeholder="sk-..."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        disabled={!newKeyName.trim() || !newKeyValue.trim()}
                      >
                        <PlusCircle className="mr-1 h-4 w-4" />
                        Add API Key
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your experience with AgentJump Studio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when renders are complete
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    defaultChecked
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes to your projects
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    defaultChecked
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import ProjectLayout from '@/pages/ProjectLayout';
import ResearchPage from '@/pages/project/ResearchPage';
import CharactersPage from '@/pages/project/CharactersPage';
import StoryboardPage from '@/pages/project/StoryboardPage';
import ShotsPage from '@/pages/project/ShotsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const user = useAppStore((state) => state.user);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
                {/* Animated gradient background */}
                <div className="pointer-events-none fixed inset-0 z-0 animate-in fade-in" aria-hidden="true"
                  style={{
                    background: 'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(0,200,255,0.18) 0%, transparent 100%), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(255,0,200,0.12) 0%, transparent 100%)',
                    filter: 'blur(32px)',
                  }}
                />
                <div className="relative z-10 glass min-h-screen">
                  <Navbar />
                  <Outlet />
                </div>
              </div>
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="projects/:id" element={<ProjectLayout />}>
            <Route index element={<Navigate to="research" replace />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="characters" element={<CharactersPage />} />
            <Route path="storyboard" element={<StoryboardPage />} />
            <Route path="shots" element={<ShotsPage />} />
          </Route>
          
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
      
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
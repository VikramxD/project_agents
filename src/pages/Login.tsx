import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Film, Github, Loader2, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setUser({
      id: '1',
      name: 'Alex Director',
      email: email,
      avatarUrl: 'https://images.pexels.com/photos/14715541/pexels-photo-14715541.jpeg?auto=compress&cs=tinysrgb&w=1600',
      apiKeys: [],
    });
    
    navigate('/dashboard');
  };
  
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px]" 
            style={{ left: '35%', top: '0%' }} />
          <div className="absolute h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px]" 
            style={{ left: '20%', top: '30%' }} />
          <div className="absolute h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-[100px]" 
            style={{ right: '30%', top: '20%' }} />
        </div>
      </div>
      
      <div className="container relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="mb-4 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
                <Film className="relative h-12 w-12 text-primary" />
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent">
                AgentJump Studio
              </h1>
              <p className="mt-2 text-white/60">
                Sign in to your account to continue
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <form onSubmit={handleLogin} className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/70">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
                
                <Button 
                  className="mt-6 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all hover:from-purple-600 hover:to-blue-600"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In with Email'
                  )}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-white/40">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </form>
            </div>
            
            <p className="mt-4 text-center text-sm text-white/40">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-white">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-white">Privacy Policy</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Login Failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-15 h-15 rounded-xl  flex items-center justify-center">
            <img src='/logo/nqnm12h2.png' className="w-16 h-16 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-primary-foreground">LakeRoad P.T.A School</h1>
            <p className="text-sm text-primary-foreground/70">Result Management System</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="font-serif text-4xl font-bold text-primary-foreground leading-tight">
            Manage Student Results<br />with Ease
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Enter marks, calculate grades automatically, and generate professional report cards for your students.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-primary-foreground/70 text-sm">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">12</p>
              <p className="text-primary-foreground/70 text-sm">Grades</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">11</p>
              <p className="text-primary-foreground/70 text-sm">Subjects</p>
            </div>
          </div>
        </div>
        
        <p className="text-primary-foreground/60 text-sm">
          &quot;Excellence Through Knowledge&quot;
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-15 h-15 rounded-xl flex items-center justify-center">
              <img src='/logo/nqnm12h2.png' className="w-14 h-14 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-foreground">LakeRoad P.T.A School</h1>
              <p className="text-sm text-muted-foreground">Result Management System</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground mt-2">
              Sign in to access the result management system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="teacher@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Contact your administrator if you need an account
          </p>
        </div>
      </div>
    </div>
  );
}
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  ClipboardList,
  GraduationCap,
  LogOut,
  User,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: ClipboardList, label: 'Enter Marks', path: '/marks' },
  { icon: FileText, label: 'Report Cards', path: '/reports' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
];

const adminNavItems = [
  { icon: UserCog, label: 'Teachers', path: '/teachers' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, role, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col no-print">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <img src='/logo/nqnm12h2.png' className="w-16 h-15"/>
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-foreground">Lake Road</h1>
            <p className="text-xs text-muted-foreground">Result System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </p>
            </div>
            {adminNavItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="px-4 py-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Current Term</p>
          <p className="text-sm font-medium text-foreground">Term 1, 2026</p>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 px-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.email}
                  </p>
                  <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs mt-0.5">
                    {isAdmin ? 'Admin' : 'Teacher'}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  );
}

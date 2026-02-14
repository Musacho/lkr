import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, UserPlus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Teacher {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher';
  createdAt: string;
}

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'teacher' as 'admin' | 'teacher'
  });
  
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchTeachers = async () => {
    try {
      // Get all profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const teacherList: Teacher[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        return {
          id: profile.user_id,
          email: '', // Will be filled if we can get it
          fullName: profile.full_name,
          role: (userRole?.role as 'admin' | 'teacher') || 'teacher',
          createdAt: profile.created_at
        };
      });

      setTeachers(teacherList);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teachers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create user using admin API through edge function would be ideal
      // For now, we'll use signUp with service role
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Assign role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: formData.role
        });

      if (roleError) throw roleError;

      toast({
        title: 'Teacher Created',
        description: `${formData.fullName} has been added successfully.`
      });

      setFormData({ email: '', password: '', fullName: '', role: 'teacher' });
      setIsDialogOpen(false);
      fetchTeachers();
    } catch (error: any) {
      console.error('Error creating teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create teacher',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: string, teacherName: string) => {
    if (!confirm(`Are you sure you want to delete ${teacherName}?`)) return;

    try {
      // Delete role first
      await supabase.from('user_roles').delete().eq('user_id', teacherId);
      
      // Delete profile
      await supabase.from('profiles').delete().eq('user_id', teacherId);

      toast({
        title: 'Teacher Deleted',
        description: `${teacherName} has been removed.`
      });

      fetchTeachers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete teacher. Note: The auth user may still exist.',
        variant: 'destructive'
      });
    }
  };

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Only administrators can access teacher management.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Teacher Management</h1>
            <p className="text-muted-foreground">Register and manage teacher accounts</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateTeacher}>
                <DialogHeader>
                  <DialogTitle>Register New Teacher</DialogTitle>
                  <DialogDescription>
                    Create a new teacher account. They will receive their login credentials.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="teacher@school.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: 'admin' | 'teacher') => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Teacher
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Teachers</CardTitle>
            <CardDescription>All teachers and administrators in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No teachers registered yet. Click "Add Teacher" to create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.fullName || 'No name'}</TableCell>
                      <TableCell>
                        <Badge variant={teacher.role === 'admin' ? 'default' : 'secondary'}>
                          {teacher.role === 'admin' ? 'Administrator' : 'Teacher'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id, teacher.fullName)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
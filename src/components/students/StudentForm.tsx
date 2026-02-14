import { useState } from 'react';
import { Student, Grade, Stream } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { optionalSubjects } from '@/data/initialData';
import { generateStudentId } from '@/lib/gradeUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  initialData?: Student;
  mode: 'add' | 'edit';
}

const grades: Grade[] = ['FORM 1', 'FORM 2','FORM 3','FORM 4', '10', '11', '12'];
const streams: Stream[] = ['ONE','TWO','THREE','A','B','C'];

export function StudentForm({ open, onOpenChange, onSubmit, initialData, mode }: StudentFormProps) {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    studentId: initialData?.studentId ?? generateStudentId(),
    grade: initialData?.grade ?? 'FORM 1',
    stream: initialData?.stream ?? 'A',
    optionalSubjects: initialData?.optionalSubjects ?? [],
    guardianName: initialData?.guardianName ?? '',
    guardianPhone: initialData?.guardianPhone ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    if (mode === 'add') {
      setFormData({
        firstName: '',
        lastName: '',
        studentId: generateStudentId(),
        grade: 'FORM 1',
        stream: 'A',
        optionalSubjects: [],
        guardianName: '',
        guardianPhone: '',
      });
    }
  };

  const toggleOptionalSubject = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      optionalSubjects: prev.optionalSubjects.includes(subjectId)
        ? prev.optionalSubjects.filter(id => id !== subjectId)
        : [...prev.optionalSubjects, subjectId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {mode === 'add' ? 'Add New Student' : 'Edit Student'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={e => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Grade</Label>
              <Select
                value={formData.grade}
                onValueChange={(value: Grade) => setFormData(prev => ({ ...prev, grade: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(g => (
                    <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stream</Label>
              <Select
                value={formData.stream}
                onValueChange={(value: Stream) => setFormData(prev => ({ ...prev, stream: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {streams.map(s => (
                    <SelectItem key={s} value={s}>Stream {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Optional Subjects</Label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg">
              {optionalSubjects.map(subject => (
                <label
                  key={subject.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={formData.optionalSubjects.includes(subject.id)}
                    onCheckedChange={() => toggleOptionalSubject(subject.id)}
                  />
                  <span className="text-sm">{subject.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">Guardian Name</Label>
              <Input
                id="guardianName"
                value={formData.guardianName}
                onChange={e => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian Phone</Label>
              <Input
                id="guardianPhone"
                value={formData.guardianPhone}
                onChange={e => setFormData(prev => ({ ...prev, guardianPhone: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Student' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

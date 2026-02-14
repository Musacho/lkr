import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ClassSelector } from '@/components/dashboard/ClassSelector';
import { StudentForm } from '@/components/students/StudentForm';
import { useApp } from '@/context/AppContext';
import { Grade, Stream, Student } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, UserCircle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { allSubjects } from '@/data/initialData';

export default function Students() {
  const [grade, setGrade] = useState<Grade>('FORM_1');
  const [stream, setStream] = useState<Stream>('A');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const { getStudentsByClass, addStudent, updateStudent, deleteStudent, loading } = useApp();
  const classStudents = getStudentsByClass(grade, stream);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const handleAddStudent = () => {
    setFormMode('add');
    setSelectedStudent(undefined);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setFormMode('edit');
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
    }
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleFormSubmit = (studentData: Omit<Student, 'id'>) => {
    if (formMode === 'add') {
      addStudent(studentData);
    } else if (selectedStudent) {
      updateStudent(selectedStudent.id, studentData);
    }
  };

  const getOptionalSubjectNames = (subjectIds: string[]) => {
    return subjectIds
      .map(id => allSubjects.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage students by grade and stream
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ClassSelector
              grade={grade}
              stream={stream}
              onGradeChange={setGrade}
              onStreamChange={setStream}
            />
            <Button onClick={handleAddStudent} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-medium text-foreground">
              Grade {grade} - Stream {stream} ({classStudents.length} students)
            </h2>
          </div>

          {classStudents.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Guardian</th>
                  <th>Optional Subjects</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => (
                  <tr key={student.id} className="animate-fade-in">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{student.studentId}</td>
                    <td>
                      {student.guardianName && (
                        <div>
                          <p className="text-foreground">{student.guardianName}</p>
                          <p className="text-sm text-muted-foreground">{student.guardianPhone}</p>
                        </div>
                      )}
                    </td>
                    <td>
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {getOptionalSubjectNames(student.optionalSubjects) || 'None'}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(student)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <UserCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No students in this class yet</p>
              <Button onClick={handleAddStudent} variant="link" className="mt-2">
                Add the first student
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Student Form Dialog */}
      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedStudent}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {studentToDelete?.firstName} {studentToDelete?.lastName}? 
              This will also delete all their marks and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

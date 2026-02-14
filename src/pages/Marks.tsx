import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ClassSelector } from '@/components/dashboard/ClassSelector';
import { EditableMarkCell } from '@/components/marks/EditableMarkCell';
import { useApp } from '@/context/AppContext';
import { Grade, Stream } from '@/types';
import { coreSubjects, allSubjects } from '@/data/initialData';
import { ClipboardList, Loader2 } from 'lucide-react';

export default function Marks() {
  const [grade, setGrade] = useState<Grade>('FORM 1');
  const [stream, setStream] = useState<Stream>('A');

  const { getStudentsByClass, getStudentMarks, updateMark, loading } = useApp();
  const classStudents = getStudentsByClass(grade, stream);

  const getStudentSubjects = (optionalSubjectIds: string[]) => {
    const optional = allSubjects.filter(s => optionalSubjectIds.includes(s.id));
    return [...coreSubjects, ...optional];
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Enter Marks</h1>
            <p className="text-muted-foreground mt-1">
              Click on any mark to edit it directly
            </p>
          </div>
          <ClassSelector
            grade={grade}
            stream={stream}
            onGradeChange={setGrade}
            onStreamChange={setStream}
          />
        </div>

        {/* Marks Entry */}
        {classStudents.length > 0 ? (
          <div className="space-y-6">
            {classStudents.map(student => {
              const studentMarks = getStudentMarks(student.id);
              const subjects = getStudentSubjects(student.optionalSubjects);

              return (
                <div
                  key={student.id}
                  className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in"
                >
                  <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subjects.length} subjects
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {subjects.map(subject => {
                        const mark = studentMarks.find(m => m.subjectId === subject.id);
                        const currentCa = mark?.caMarks ?? 0;
                        const currentExam = mark?.examMarks ?? 0;

                        return (
                          <div
                            key={subject.id}
                            className="p-3 bg-muted/30 rounded-lg"
                          >
                            <p className="text-sm text-muted-foreground mb-2 truncate">
                              {subject.name}
                            </p>
                            <EditableMarkCell
                              caMarks={currentCa}
                              examMarks={currentExam}
                              onSave={(ca, exam) => updateMark(student.id, subject.id, ca, exam)}
                              maxMarks={subject.maxMarks}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No students in Grade {grade} - Stream {stream}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add students first to enter their marks
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

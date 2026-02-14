import { MainLayout } from '@/components/layout/MainLayout';
import { coreSubjects, optionalSubjects } from '@/data/initialData';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function Subjects() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground mt-1">
            Core and optional subjects offered at the school
          </p>
        </div>

        {/* Core Subjects */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-primary/5">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-medium text-foreground">Core Subjects</h2>
              <span className="text-sm text-muted-foreground">
                (Compulsory for all students)
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreSubjects.map(subject => (
                <div
                  key={subject.id}
                  className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-foreground">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Max marks: {subject.maxMarks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Subjects */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-accent/10">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="font-medium text-foreground">Optional Subjects</h2>
              <span className="text-sm text-muted-foreground">
                (Students choose based on interest)
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optionalSubjects.map(subject => (
                <div
                  key={subject.id}
                  className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-accent" />
                  <div>
                    <p className="font-medium text-foreground">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Max marks: {subject.maxMarks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grading Scale */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-medium text-foreground">Grading Scale</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="p-4 rounded-lg grade-badge-a">
                <p className="text-2xl font-bold">Distinction</p>
                <p className="text-sm opacity-90">80-100%</p>
                <p className="text-xs opacity-75">Excellent</p>
              </div>
              <div className="p-4 rounded-lg grade-badge-b">
                <p className="text-2xl font-bold">Merit</p>
                <p className="text-sm opacity-90">70-79%</p>
                <p className="text-xs opacity-75">Very Good</p>
              </div>
              <div className="p-4 rounded-lg grade-badge-c">
                <p className="text-2xl font-bold">Credit</p>
                <p className="text-sm opacity-90">60-69%</p>
                <p className="text-xs opacity-75">Good</p>
              </div>
              <div className="p-4 rounded-lg grade-badge-d">
                <p className="text-2xl font-bold">Pass</p>
                <p className="text-sm opacity-90">50-59%</p>
                <p className="text-xs opacity-75">Satisfactory</p>
              </div>
              <div className="p-4 rounded-lg grade-badge-f">
                <p className="text-2xl font-bold">Fail</p>
                <p className="text-sm opacity-90">0-49%</p>
                <p className="text-xs opacity-75">Needs Work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

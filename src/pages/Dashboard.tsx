import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ClassSelector } from '@/components/dashboard/ClassSelector';
import { useApp } from '@/context/AppContext';
import { Grade, Stream } from '@/types';
import { Users, Award, BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getGradeColor } from '@/lib/gradeUtils';

export default function Dashboard() {
  const [grade, setGrade] = useState<Grade>('FORM 1');
  const [stream, setStream] = useState<Stream>('A');
  const { students, loading, getStudentsByClass, getClassRankings } = useApp();

  const classStudents = getStudentsByClass(grade, stream);
  const rankings = getClassRankings(grade, stream);
  const topPerformers = rankings.slice(0, 5);
  
  const classAverage = rankings.length > 0
    ? (rankings.reduce((sum, r) => sum + r.average, 0) / rankings.length).toFixed(1)
    : '0';

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
            <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of student performance and class statistics
            </p>
          </div>
          <ClassSelector
            grade={grade}
            stream={stream}
            onGradeChange={setGrade}
            onStreamChange={setStream}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={students.length}
            subtitle="Across all grades"
            icon={Users}
          />
          <StatCard
            title="Class Students"
            value={classStudents.length}
            subtitle={`Grade ${grade} - Stream ${stream}`}
            icon={Users}
          />
          <StatCard
            title="Class Average"
            value={`${classAverage}%`}
            subtitle="Current term"
            icon={TrendingUp}
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatCard
            title="Subjects"
            value="11"
            subtitle="5 core + 6 optional"
            icon={BookOpen}
          />
        </div>

        {/* Top Performers */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Top Performers</h2>
              <p className="text-sm text-muted-foreground">Grade {grade} - Stream {stream}</p>
            </div>
          </div>

          {topPerformers.length > 0 ? (
            <div className="space-y-3">
              {topPerformers.map((item, index) => {
                const { student, average, position } = item;
                const grade = average >= 80 ? 'A' : average >= 70 ? 'B' : average >= 60 ? 'C' : average >= 50 ? 'D' : 'F';
                
                return (
                  <div
                    key={student.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg transition-colors',
                      index === 0 ? 'bg-accent/10' : 'bg-muted/30 hover:bg-muted/50'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      index === 0 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      {position}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{average.toFixed(1)}%</p>
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        getGradeColor(grade)
                      )}>
                        Grade {grade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No students found in this class
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
